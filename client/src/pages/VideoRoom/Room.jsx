import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { PackedGrid } from 'react-packed-grid';
import '../../components/VideoCall/VideoCall.scss';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import camera from '../../assets/camera.svg'
import camerastop from '../../assets/camera-stop.svg'
import microphone from '../../assets/microphone.svg'
import microphonestop from '../../assets/microphone-stop.svg'
import hangup from '../../assets/hang-up.svg'
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreateIcon from '@material-ui/icons/Create';
import { Avatar, IconButton } from '@material-ui/core';
import Input from '../../components/Auth/Input';
import SendIcon from '@material-ui/icons/Send';
import { getEvent, eventMessage, updateEvent, getEvents } from '../../actions/events';
import '../../components/ChatRooms/ChatRooms.scss';
import './Room.scss'
import moment from 'moment';

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    // eslint-disable-next-line
    }, []);

    return (
        <video playsInline autoPlay ref={ref} className="video__tile" />
    );
}

const Room = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState();
    const [audioMuted, setAudioMuted] = useState(false)
    const [videoMuted, setVideoMuted] = useState(false)
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const myPeer = useRef();
    const { roomId } = useParams();
    const location = useLocation();
    const { event } = useSelector(state => state.events);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        if (roomId) {
            console.log(roomId);
            dispatch(getEvent(roomId));
        }
    }, [dispatch, roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [event?.Messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socketRef.current.emit('chat message', message, currentUser.result.name, currentUser.result._id);
            const finalMessage = { sender: currentUser.result.name, senderId: currentUser.result._id, message: message, timestamp: new Date() }
            dispatch(eventMessage(finalMessage, roomId));
            dispatch(updateEvent(roomId, {
                Subject: event.Subject,
                StartTime: event.StartTime,
                EndTime: event.EndTime,
                Attendees: event.Attendees,
                Description:event.Description,
                UpdatedAt: new Date(),
            }));
            event.Messages.push(finalMessage);
            dispatch(getEvents());
            scrollToBottom();
        }
        setMessage('');
    }

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");

        socketRef.current.on('chat message', (msg, sender, senderId) => {
            dispatch(getEvent(roomId));
            dispatch(getEvents());
            scrollToBottom();
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name});
            socketRef.current.on("all users", users => {
                console.log(users.length);
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, currentUser.result.name, stream);
                    peersRef.current.push({
                        peerID: user.id,
                        peerName: user.name,
                        peer,
                    })
                    peers.push({
                        peerID: user.id,
                        peerName: user.name,
                        peer,
                    });
                })
                setPeers(peers);
            });

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peerName: payload.callerName,
                    peer,
                })

                const peerObj = {
                    peerID : payload.callerID,
                    peerName: payload.callerName,
                    peer,
                }

                setPeers(users => [...users, peerObj]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on('user left', id => {
                const peerObj = peersRef.current.find(p => p.peerID === id);
                if (peerObj) {
                    peerObj.peer.destroy();
                }
                const peers = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = peers;
                setPeers(peers);
            });
        });
    // eslint-disable-next-line
    }, []);

    function createPeer(userToSignal, callerID, callerName, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, callerName, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    function shareScreen(){
        navigator.mediaDevices.getDisplayMedia({cursor: true})
        .then(screenStream => {
            // eslint-disable-next-line
            peers.map(peer => {
                myPeer.current = peer.peer;
                myPeer.current.replaceTrack(stream.getVideoTracks()[0], screenStream.getVideoTracks()[0], stream);
                userVideo.current.srcObject = screenStream;
            })
            screenStream.getTracks()[0].onended = () => {
                // eslint-disable-next-line
                peers.map(peer => {
                    myPeer.current = peer.peer;
                    myPeer.current.replaceTrack(screenStream.getVideoTracks()[0], stream.getVideoTracks()[0], stream);
                    userVideo.current.srcObject = stream;
                })
            }
        })
    }

    function endCall() {
        window.close();
    }

    function toggleMuteAudio(){
        if(stream) {
            setAudioMuted(!audioMuted)
            stream.getAudioTracks()[0].enabled = audioMuted
        }
    }
    
    function toggleMuteVideo(){
        if(stream) {
            setVideoMuted(!videoMuted)
            stream.getVideoTracks()[0].enabled = videoMuted
        }
    }

    let hangUp=<span className="options-div" onClick={()=>endCall()}>
        <img className="video-options" src={hangup} alt="End call"/>
    </span>

    let audioControl;
    if(audioMuted){
        audioControl=<div className="options-div" onClick={()=>toggleMuteAudio()}>
            <img className="video-options" src={microphonestop} alt="Unmute audio"/>
        </div>
    } else {
        audioControl=<div className="options-div" onClick={()=>toggleMuteAudio()}>
            <img className="video-options" src={microphone} alt="Mute audio"/>
        </div>
    }

    let videoControl;
    if(videoMuted){
        videoControl=<div className="options-div" onClick={()=>toggleMuteVideo()}>
            <img className="video-options" src={camerastop} alt="Resume video"/>
        </div>
    } else {
        videoControl=<div className="options-div" onClick={()=>toggleMuteVideo()}>
            <img className="video-options" src={camera} alt="Stop audio"/>
        </div>
    }

    const updateLayoutRef = useRef();

    return (
        <div className="videoconference">
            <div className="videoroom">
                <div className="video">
                    <div>
                        <PackedGrid className='fullscreen' updateLayoutRef={updateLayoutRef}>
                            <div className="video__tile">
                                <h5>{currentUser.result.name}</h5>
                                <video muted ref={userVideo} autoPlay playsInline className="video__tile" />
                            </div>
                            {peers.map((peer, i) => {
                                return (
                                    <div key={i} className="video__tile">
                                        <h5>{peer.peerName}</h5>
                                        <Video key={peer.peerID} peer={peer.peer} />
                                    </div>
                                );
                            })}
                        </PackedGrid>
                    </div>
                    <div className="video__controls">
                        {audioControl}
                        {videoControl}

                        <div className="options-div">
                            <ScreenShareIcon fontSize="large" className="video-options" onClick={shareScreen}></ScreenShareIcon>
                        </div>
                        {hangUp}                    
                    </div>
                </div>
            </div>
            <div className="chat">
                <div className="chatroom">
                    <div className="chatroom__header">
                        <Avatar />
                        {event ? <h5>{event.Subject}</h5> : <h5>Teams Clone Chat</h5>}
                        <CreateIcon />
                    </div>
                    <div id="messages" className="chatroom__body">
                        {event?.Messages.sort((a, b) => a - b)?.map((message, i) => {
                            return (
                                <div key={i} className="chatroom__message">
                                    {message.senderId === currentUser.result._id ?
                                        <div className="mychat">
                                            <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                                            <p key={i}>{message.message}</p>
                                        </div>
                                    : 
                                        <div className="peerchat">
                                            <Avatar alt={message.sender.charAt(0)}>{message.sender.charAt(0)}</Avatar>
                                            <div className="peer">
                                                <span>{message.sender}</span>
                                                <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                                                <p key={i}>{message.message}</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    <div>
                        <form className="chatroom__sendMessage">
                            <Input name="message" label="Type a new message" value={message} handleChange={handleChange} autoFocus />
                            <IconButton type="submit" onClick={(e) => {handleSubmit(e)}}>
                                <SendIcon />
                            </IconButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
