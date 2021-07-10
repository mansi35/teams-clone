import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import ChatRoom from '../../components/ChatRooms/ChatRoom';
import { useDispatch } from 'react-redux';
import { getEvents } from '../../actions/events';
import { getUsers } from '../../actions/users';
import './Chat.scss';
import { getConversations } from '../../actions/conversations';

const Chat = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
        dispatch(getConversations());
        dispatch(getUsers());
    }, [dispatch]);

    return (
        <div className="chat">
            <Sidebar />
            <div className="chat__rooms">
                <ChatRooms />
                <div style={{ width: "70vw" }}>
                    <ChatRoom />
                </div>
            </div>
        </div>
    )
}

export default Chat
