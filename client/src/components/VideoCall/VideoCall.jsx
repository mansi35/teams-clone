import React, { useEffect, useRef, useState } from "react";
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import { PackedGrid } from 'react-packed-grid';
import './VideoCall.scss';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import camera from '../../assets/camera.svg';
import camerastop from '../../assets/camera-stop.svg';
import microphone from '../../assets/microphone.svg';
import microphonestop from '../../assets/microphone-stop.svg';
import hangup from '../../assets/hang-up.svg';
import { useParams } from "react-router-dom";

let client, signal;

const VideoCall = () => {
    // const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [stream, setStream] = useState();
    const [audioMuted, setAudioMuted] = useState(false)
    const [videoMuted, setVideoMuted] = useState(false)
    const [remoteStream, setRemoteStream] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef =useRef([]);
    const { roomId } = useParams();
    // const location = useLocation();

    const config = {
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
    };

    // useEffect(() => {
    //     setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    // }, [location]);

    useEffect(() => {
        signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
        client = new Client(signal, config);
        signal.onopen = () => client.join(roomId);
        
        LocalStream.getUserMedia({
            resolution: 'vga',
            audio: true,
            codec: "vp8"
        }).then((media) => {
            localVideoRef.current.srcObject = media;
            localVideoRef.current.autoplay = true;
            localVideoRef.current.playsInline = true;
            localVideoRef.current.muted = true;
            setStream(media);
            client.publish(media);
        }).catch(console.error);
    
        client.ontrack = (track, stream) => {
            console.log("got track: ", track.id, "for stream: ", stream.id);
            if (track.kind === 'video') {
                track.onunmute = () => {
                    setRemoteStream(remoteStream => [...remoteStream, {id: track.id, stream: stream}]);
                    setCurrentVideo(track.id);
            
                    stream.onremovetrack = (e) => {
                        setRemoteStream(remoteStream => remoteStream.filter(item => item.id !== e.track.id));
                    }
                }
            }
        }
        // eslint-disable-next-line
      }, []);

      useEffect(() => {
        const videoEl = remoteVideoRef.current[currentVideo];
        remoteStream.forEach(ev => {
          if (ev.id === currentVideo) {
            videoEl.srcObject = ev.stream;
          }
        });
      // eslint-disable-next-line
      }, [currentVideo]);
    

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
        <div className="video">
            <div>
            <PackedGrid className='fullscreen' updateLayoutRef={updateLayoutRef}>
                <video className={`bg-black h-full w-full video__tile`} autoPlay playsInline ref={localVideoRef}></video>
                {remoteStream.map((val, index) => {
                    return (
                      <video key={index} ref={(el) => remoteVideoRef.current[val.id] =el} className="bg-black w-full h-full video__tile" autoPlay playsInline></video>
                    )
                })}
                </PackedGrid>
            </div>
            <div className="video__controls">
                {audioControl}
                {videoControl}

                {/*<div className="options-div">
                    <ScreenShareIcon fontSize="large" className="video-options" onClick={shareScreen}></ScreenShareIcon>
                </div>*/}
                {hangUp}                    
            </div>
        </div>
    );
};

export default VideoCall;
