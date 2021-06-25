import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatRooms from '../../components/ChatRooms/ChatRooms';
import './Chat.scss';

const Chat = () => {
    return (
        <div className="chat">
            <div className="chat__content">
                <Sidebar />
                <div className="chat__rooms">
                    <ChatRooms />
                </div>
            </div>
        </div>
    )
}

export default Chat
