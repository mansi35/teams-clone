import React, { useState } from 'react';
import ChatRoomItem from './ChatRoomItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FilterListIcon from '@material-ui/icons/FilterList';
import './ChatRooms.scss'
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import CreateChatModal from './CreateChatModal';

const ChatRooms = () => {
    const { events } = useSelector((state) => state.events);
    const { conversations } = useSelector((state) => state.conversations);
    const users = useSelector((state) => state.users);
    const [options, setOptions] = useState([]);
    const [isShowing, setIsShowing] = useState(false);

    const openCreateChatModal = () => {
        setIsShowing(true);
        users.forEach(user => {
            setOptions(prevOptions => [...prevOptions, { value: user._id, label: user.name }]);
        });
    }

    const closeCreateChatModal = () => {
        setIsShowing(false);
        setOptions([]);
    }

    return (
        <div className="chatrooms">
            { isShowing ? <div onClick={() => {closeCreateChatModal()}} className="back-drop"></div> : null }
            <div className="chatrooms__header">
                <div className="header__left">
                    <h5>Chat</h5>
                    <ExpandMoreIcon />
                </div>
                <div className="header__right">
                    <FilterListIcon />
                    <IconButton onClick={() => {openCreateChatModal()}}>
                        <img src="https://img.icons8.com/fluent-systems-regular/48/000000/edit-chat-history.png" alt="new chat"/>
                    </IconButton>
                </div>
            </div>
            <div className="chatrooms__rooms">
                {events.concat(conversations).sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)).map((event) => {
                    return (
                        <ChatRoomItem key={event._id} event={event} />
                    )
                })}
            </div>
            <CreateChatModal className="modal" show={isShowing} close={closeCreateChatModal} options={options} />
        </div>
    )
}

export default ChatRooms
