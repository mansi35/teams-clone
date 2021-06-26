import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import ChatRoom from '../../components/ChatRooms/ChatRoom';
import './Chat.scss';

const Chat = () => {
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
