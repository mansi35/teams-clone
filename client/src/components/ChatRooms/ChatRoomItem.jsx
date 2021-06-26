import React from 'react';
import { Avatar } from '@material-ui/core';

const ChatRoomItem = () => {
    return (
        <div className="chatroom__item">
            <Avatar src="" />
            <div className="chatroom__info">
                <div className="chatRoom__title">
                    <h6>Diksha and Rishabh</h6>
                    <h6>25/06</h6>
                </div>
                <div className="chatroom__message">
                    <span>You: Okay I get it now what you meant. Thanks f...</span>
                </div>
            </div>
        </div>
    );
}

export default ChatRoomItem
