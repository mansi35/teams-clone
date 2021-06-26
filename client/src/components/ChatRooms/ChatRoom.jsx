import React, { useEffect, useRef, useState } from 'react';
import CreateIcon from '@material-ui/icons/Create';
import { Avatar, IconButton } from '@material-ui/core';
import Input from '../Auth/Input';
import SendIcon from '@material-ui/icons/Send';
import { useLocation, useParams } from 'react-router-dom';
import io from "socket.io-client";
import './ChatRooms.scss';

const ChatRoom = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [message, setMessage] = useState('');
    const { roomId } = useParams();
    const socketRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    // eslint-disable-next-line
    }, [location]);

    useEffect(() => {
        if (roomId) {
            socketRef.current = io.connect("http://localhost:5000");
            socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name});
            socketRef.current.on('chat message', function(msg) {
                var item = document.createElement('li');
                item.textContent = msg;
                const messages = document.getElementById('messages')
                messages.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            });
        }
        // eslint-disable-next-line
    }, [])

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socketRef.current.emit('chat message', message);
            console.log(message);
        }
    }

    return (
        <div className="chatroom">
            <div className="chatroom__header">
                <Avatar />
                <h5>Chat Title</h5>
                <CreateIcon />
            </div>
            <div id="messages" className="chatroom__body">
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
}

export default ChatRoom
