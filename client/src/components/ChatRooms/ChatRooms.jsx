import React from 'react';
import ChatRoomItem from './ChatRoomItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';
import CreateIcon from '@material-ui/icons/Create';
import './ChatRooms.scss'

const ChatRooms = () => {
    return (
        <div className="chatrooms">
            <div className="chatrooms__header">
                <div className="header__left">
                    <h5>Chat</h5>
                    <ExpandMoreIcon />
                </div>
                <div className="header__right">
                    <FilterListIcon />
                    <CreateIcon />
                </div>
            </div>
            <div className="chatrooms__rooms">
                <ChatRoomItem />
                <ChatRoomItem />
                <ChatRoomItem />
                <ChatRoomItem />
            </div>
        </div>
    )
}

export default ChatRooms
