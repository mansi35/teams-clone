import React, { useEffect, useRef, useState } from 'react';
import CreateIcon from '@material-ui/icons/Create';
import { Avatar, IconButton } from '@material-ui/core';
import Input from '../Auth/Input';
import SendIcon from '@material-ui/icons/Send';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvent, eventMessage, updateEvent, getEvents } from '../../actions/events';
import io from "socket.io-client";
import './ChatRooms.scss';
import moment from 'moment';

const ChatRoom = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const { event } = useSelector(state => state.events);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState({});
    const messagesEndRef = useRef(null);
    const { roomId } = useParams();
    const socketRef = useRef();
    const location = useLocation();

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
        socketRef.current = io.connect("http://localhost:5000");
    }, [])

    useEffect(() => {
        if (roomId) {
            socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name });
            socketRef.current.on('chat message', (msg, sender, senderId) => {
                setNewMessage({
                    senderId: senderId,
                    sender: sender,
                    message: msg,
                    timestamp: new Date(),
                });
            });
        }
        setNewMessage([]);
        // eslint-disable-next-line
    }, [roomId])

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
            const finalMessage = { sender: currentUser.result.name, message: message, timestamp: new Date() }
            dispatch(eventMessage(finalMessage, roomId));
            dispatch(updateEvent(roomId, {
                Subject: event.Subject,
                StartTime: event.StartTime,
                EndTime: event.EndTime,
                Attendees: event.Attendees,
                Description:event.Description,
                UpdatedAt: new Date(),
            }));
            dispatch(getEvents());
            dispatch(getEvent(roomId));
        }
        setMessage('');
    }
    if (event && roomId) {

        return (
            <div className="chatroom">
                <div className="chatroom__header">
                    <Avatar />
                    {event ? <h5>{event.Subject}</h5> : <h5>Teams Clone Chat</h5>}
                    <CreateIcon />
                </div>
                <div id="messages" className="chatroom__body">
                    {[...new Set(event.Messages.sort((a, b) => a - b).concat(newMessage))]?.map((message, i) => {
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
        )
    } else {
        return null;
    }
}

export default ChatRoom
