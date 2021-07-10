import React from 'react';
import ChatRoomItem from './ChatRoomItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';
import './ChatRooms.scss'
import { useSelector } from 'react-redux';

const ChatRooms = () => {
    const { events } = useSelector((state) => state.events);
    console.log(events);

    return (
        <div className="chatrooms">
            <div className="chatrooms__header">
                <div className="header__left">
                    <h5>Chat</h5>
                    <ExpandMoreIcon />
                    <img src="https://img.icons8.com/fluent-systems-regular/48/000000/edit-chat-history.png" alt="new chat"/>
                </div>
                <div className="header__right">
                    <FilterListIcon />
                </div>
            </div>
            <div className="chatrooms__rooms">
                {events.map((event) => {
                    return (
                        <ChatRoomItem key={event._id} event={event} />
                    )
                })}
                <div className="chatroom__item"></div>
            </div>
        </div>
    )
}

export default ChatRooms
