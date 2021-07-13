import React, { useEffect, useRef, useState } from 'react';
import CreateIcon from '@material-ui/icons/Create';
import { Avatar, IconButton } from '@material-ui/core';
import FileBase from 'react-file-base64';
import Input from '../Auth/Input';
import SendIcon from '@material-ui/icons/Send';
import CallIcon from '@material-ui/icons/Call';
import Tooltip from '@material-ui/core/Tooltip';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvent, eventMessage, updateEvent } from '../../actions/events';
import { getConversation, updateConversation } from '../../actions/conversations';
import chatImage from '../../assets/chat.gif';
import io from "socket.io-client";
import './ChatRooms.scss';
import moment from 'moment';

const ChatRoom = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const { event } = useSelector(state => state.events);
    const { conversation } = useSelector(state => state.conversations);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [file, setFile] = useState();
    const [messages, setMessages] = useState([]);
    const [confirm, setImgUploadConfirm] = useState('');
    const messagesEndRef = useRef(null);
    const { roomId, type } = useParams();
    const socketRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        if (roomId && type) {
            dispatch(getConversation(roomId));
        } else {
            dispatch(getEvent(roomId));
        }
    }, [dispatch, roomId, type]);

    useEffect(() => {
        socketRef.current = io.connect("https://teams-clone-server.herokuapp.com");
    }, [])

    useEffect(() => {
        if (roomId) {
            scrollToBottom();
            socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name });
            socketRef.current.on('chat message', (finalMessage) => {
                setMessages(oldMsgs => [...oldMsgs, {sender: finalMessage.sender, senderId: finalMessage.senderId, message: finalMessage.message, body: finalMessage.body, type: finalMessage.type, timestamp: new Date()}])
                scrollToBottom();
            });
        }
        // eslint-disable-next-line
    }, [roomId])

    useEffect(() => {
        scrollToBottom();
        if (type) {
            setMessages(conversation?.Messages);
        } else {
            setMessages(event?.Messages);
        }
    }, [event?.Messages, event, conversation?.Messages, conversation, type]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            if (file) {
                const finalMessage = { sender: currentUser.result.name, senderId: currentUser.result._id, message: message, body: file, type: "file", timestamp: new Date() };
                socketRef.current.emit('chat message', finalMessage);
                setMessages(oldMsgs => [...oldMsgs, finalMessage]);
                if (type) {
                    dispatch(updateConversation(finalMessage, roomId));    
                } else {
                    dispatch(eventMessage(finalMessage, roomId));
                }
                setFile();
            } else {
                const finalMessage = { sender: currentUser.result.name, senderId: currentUser.result._id, message: message, type: "text", timestamp: new Date() };
                socketRef.current.emit('chat message', finalMessage);
                setMessages(oldMsgs => [...oldMsgs, finalMessage]);
                if (type) {
                    dispatch(updateConversation(finalMessage, roomId));    
                } else {
                    dispatch(eventMessage(finalMessage, roomId));
                }
            }
            if (!type) {
                dispatch(updateEvent(roomId, {
                    UpdatedAt: new Date(),
                }));
            }
            scrollToBottom();
        }
        setMessage('');
        setImgUploadConfirm('');
    }

    const callNow = () => {
        const finalMessage = { sender: currentUser.result.name, senderId: currentUser.result._id, message: `${currentUser.result.name} has started a video call. Click on the call icon to join the call.`, type: "text", timestamp: new Date() };
        socketRef.current.emit('chat message', finalMessage);
        setMessages(oldMsgs => [...oldMsgs, finalMessage]);
        if (type) {
            dispatch(updateConversation(finalMessage, roomId));    
        } else {
            dispatch(eventMessage(finalMessage, roomId));
            dispatch(updateEvent(roomId, {
                UpdatedAt: new Date(),
            }));
        }
    }

    const renderMessages = (message, index) => {
        if (message.type === "file") {
            if (message.senderId === currentUser.result._id) {
                return (
                    <div key={index} className="chatroom__message">
                        <div className="mychat">
                            <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                            <img src={message.body} alt="" style={{ width: 250, height: "auto" }} />
                            <p key={index}>{message.message}</p>
                        </div>
                    </div>
                );
            }
            return (
                <div key={index} className="chatroom__message">
                    <div className="peerchat">
                        <Avatar alt={message.sender.charAt(0)}>{message.sender.charAt(0)}</Avatar>
                        <div className="peer">
                            <span>{message.sender}</span>
                            <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                            <img src={message.body} alt="" style={{ width: 250, height: "auto" }} />
                            <p key={index}>{message.message}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (message.senderId === currentUser.result._id) {
                return (
                    <div key={index} className="chatroom__message">
                        <div className="mychat">
                            <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                            <p key={index}>{message.message}</p>
                        </div>
                    </div>
                );
            }
            return (
                <div key={index} className="chatroom__message">
                    <div className="peerchat">
                        <Avatar alt={message.sender.charAt(0)}>{message.sender.charAt(0)}</Avatar>
                        <div className="peer">
                            <span>{message.sender}</span>
                            <span>{moment(message.timestamp).format("DD/MM, hh:mm")}</span>
                            <p key={index}>{message.message}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const uploadFileWithClick = () => {
        document.getElementsByClassName('message__imageSelector')[0].childNodes[1].click()
    }

    if (event && roomId && messages && !type) {
        return (
            <div className="chatroom">
                <div className="chatroom__header">
                    <div className="chatroom__headerleft">
                        <Avatar>{event.Subject.charAt(0)}</Avatar>
                        {event ? <h5>{event.Subject}</h5> : <h5>Teams Clone Chat</h5>}
                        <Tooltip title="Edit">
                            <IconButton>
                                <CreateIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="chatroom__headerright">
                        <Link to={`/room/${roomId}`} target="_blank">
                            <Tooltip title="Call">
                                <IconButton onClick={() => {callNow()}}>
                                    <CallIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </div>
                </div>
                <div id="messages" className="chatroom__body">
                    {messages.sort((a, b) => a - b)?.map(renderMessages)}
                    <div ref={messagesEndRef} />
                </div>
                <div>
                    <form className="chatroom__sendMessage">
                        <div className="message__imageSelector" onClick={() => {uploadFileWithClick()}}>
                            <PhotoLibraryIcon style={{ color: "#464775" }} />
                            <FileBase className="message__image" type="file" multiple={false} onDone={({ base64 }) => {
                                setFile(base64);
                                setImgUploadConfirm('Image is selected and will be displayed after sending the message!')
                            }} />
                        </div>
                        <Input name="message" label="Type a new message" value={message} handleChange={handleChange} autoFocus />
                        <IconButton type="submit" onClick={(e) => {handleSubmit(e)}}>
                            <SendIcon />
                        </IconButton>
                    </form>
                </div>
                <p className="image__text">{confirm}</p>
            </div>
        )
    } else if (conversation && roomId && messages) {
        return (
            <div className="chatroom">
                <div className="chatroom__header">
                    <div className="chatroom__headerleft">
                        <Avatar>{conversation.Subject.charAt(0)}</Avatar>
                        {conversation ? <h5>{conversation.Subject}</h5> : <h5>Teams Clone Chat</h5>}
                        <Tooltip title="Edit">
                            <IconButton>
                                <CreateIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="chatroom__headerright">
                        <Link to={`/room/${roomId}/1`} target="_blank">
                            <Tooltip title="Call">
                                <IconButton onClick={() => {callNow()}}>
                                    <CallIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </div>
                </div>
                <div id="messages" className="chatroom__body">
                    {messages.sort((a, b) => a - b)?.map(renderMessages)}
                    <div ref={messagesEndRef} />
                </div>
                <div>
                    <form className="chatroom__sendMessage">
                        <div className="message__imageSelector" onClick={() => {uploadFileWithClick()}}>
                            <PhotoLibraryIcon style={{ color: "#464775" }} />
                            <FileBase className="message__image" type="file" multiple={false} onDone={({ base64 }) => {
                                setFile(base64);
                                setImgUploadConfirm('Image is selected and will be displayed after sending the message!')
                            }} />
                        </div>
                        <Input name="message" label="Type a new message" value={message} handleChange={handleChange} autoFocus />
                        <IconButton type="submit" onClick={(e) => {handleSubmit(e)}}>
                            <SendIcon />
                        </IconButton>
                    </form>
                </div>
                <p className="image__text">{confirm}</p>
            </div>
        )
    } else {
        return (
            <div className="emptychat">
                <h4>Start discussions with your teams and friends!<br/>Start by creating a new chat or open up an existing chat.</h4>
                <img src={chatImage} alt="chat page" />
            </div>
        )
    }
}

export default ChatRoom
