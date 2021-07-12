import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Sidebar.scss';
import SidebarItem from './SidebarItem';
import calendar from '../../assets/calendar.svg';
import chat from '../../assets/chat.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { v1 as uuid } from 'uuid';
import { getAccessToken } from '../../api/github';
import LoginGithub from 'react-login-github';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../actions/events';
import moment from 'moment';

function Sidebar() {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('git_oauth')));
    const location = useLocation();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [videoId, setVideoId] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);
  
    useEffect(() => {
        setAuth(JSON.parse(localStorage.getItem('git_oauth')));
    }, [location]);

    const onSuccess = async(response) => {
        const result = await getAccessToken(response.code);
        console.log(result);
        localStorage.setItem('git_oauth', JSON.stringify(result));
    }
    const onFailure = response => console.error(response);

    const createId = () => {
        const id = uuid();
        history.push(`/board/${id}`);
    }

    const createNewEvent = () => {
        const meetingId = uuid();
        setVideoId(meetingId);
        dispatch(createEvent({
            Subject: `Meeting on ${moment(new Date()).format("DD/MM/YYYY")}`,
            StartTime: new Date(),
            EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
            _id: meetingId,
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        }));
    }

    return (
        <div className="sidebar">
            <Link to={`/room/${videoId}`} target="_blank">
                <div onClick={() => {createNewEvent()}}>
                    <SidebarItem 
                        icon="https://img.icons8.com/ios/36/000000/video-conference.png"
                        text="New Meeting"
                        hoverIcon="https://img.icons8.com/ios/36/6264A7/video-conference.png"
                    />
                </div>
            </Link>
            <Link to="/chat">
                <SidebarItem
                    icon="https://img.icons8.com/fluent-systems-regular/48/000000/chat-message.png"
                    text="Chat"
                    hoverIcon={chat}
                />
            </Link>
            {auth ?
                <Link to="/github">
                    <SidebarItem
                        icon="https://img.icons8.com/ios/36/000000/github--v1.png"
                        text="GitHub"
                        hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/github.png"
                    />
                </Link>
            :
                <LoginGithub clientId="f6099a354e555e602bcb"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    scope="admin:org repo user"
                    className="auth__button"
                >
                    <Link to="/github">
                        <SidebarItem
                            icon="https://img.icons8.com/ios/36/000000/github--v1.png"
                            text="GitHub"
                            hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/github.png"
                        />
                    </Link>
                </LoginGithub>
            }
            <div onClick={() => {createId()}}>
                <SidebarItem
                    icon="https://img.icons8.com/ios/36/000000/whiteboard.png"
                    text="Blackboard"
                    hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/whiteboard.png"
                />
            </div>
            <Link to="/calendar">
                <SidebarItem
                    icon="https://img.icons8.com/fluent-systems-regular/48/000000/calendar--v1.png"
                    text="Calendar"
                    hoverIcon={calendar}
                />
            </Link>
            <div className="sidebarItem">
                <MoreHorizIcon />
            </div>
        </div>
    )
}

export default Sidebar
