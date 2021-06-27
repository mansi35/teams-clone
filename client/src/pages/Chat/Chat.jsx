import React, { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import ChatRoom from '../../components/ChatRooms/ChatRoom';
import { useDispatch } from 'react-redux';
import { getEvents } from '../../actions/events';
import './Chat.scss';

const Chat = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    return (
        <div className="chat">
            <Sidebar />
            <div className="chat__rooms">
                <ChatRooms />
                <ChatRoom />
            </div>
        </div>
    )
}

export default Chat
