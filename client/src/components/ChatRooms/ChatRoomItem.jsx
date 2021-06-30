import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';

const ChatRoomItem = ({ event }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const goToRoom = (id) => {
        history.push(`/chat/${id}`)
    }

    return (
        <div key={event._id} className="chatroom__item" onClick={() => {goToRoom(event._id)}}>
            <Avatar src="" />
            <div className="chatroom__info">
                <div className="chatRoom__title">
                    <h6>{event.Subject}</h6>
                    <h6>{moment(event.StartTime).format("DD/MM")}</h6>
                </div>
                <div className="chatroom__message">
                    {event.Messages.length > 0 ?
                        [event.Messages[event.Messages.length - 1].senderId === currentUser.result._id ? (
                            [event.Messages[event.Messages.length - 1].message.length > 42 ?
                                <span>{'You: '}{event.Messages[event.Messages.length - 1].message.slice(0, 42)}{'...'}</span>
                            :   <span>{'You: '}{event.Messages[event.Messages.length - 1].message}</span>
                            
                            ]) : (
                            [event.Messages[event.Messages.length - 1].message.length > 42 ?
                                <span>{event.Messages[event.Messages.length - 1].sender}{': '}{event.Messages[event.Messages.length - 1].message.slice(0, 42)}{'...'}</span>
                            :   <span>{event.Messages[event.Messages.length - 1].sender}{': '}{event.Messages[event.Messages.length - 1].message}</span>
                            
                            ])]
                    : null}
                </div>
            </div>
        </div>
    );
}

export default ChatRoomItem
