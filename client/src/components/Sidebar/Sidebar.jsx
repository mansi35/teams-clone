import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Sidebar.scss';
import SidebarItem from './SidebarItem';
import calendar from '../../assets/calendar.svg';
import activity from '../../assets/activity.svg';
import chat from '../../assets/chat.svg';
import calls from '../../assets/calls.svg';
import files from '../../assets/files.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { v1 as uuid } from 'uuid';
import { getAccessToken } from '../../api/github';
import LoginGithub from 'react-login-github';

function Sidebar() {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('git_oauth')));
    const location = useLocation();
    const history = useHistory();
  
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

    return (
        <div className="sidebar">
            <SidebarItem
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/appointment-reminders--v1.png"
                text="Activity"
                hoverIcon={activity}
            />
            <Link to="/chat">
                <SidebarItem
                    icon="https://img.icons8.com/fluent-systems-regular/48/000000/chat-message.png"
                    text="Chat"
                    hoverIcon={chat}
                />
            </Link>
            <div onClick={() => {createId()}}>
                <SidebarItem
                    icon="https://img.icons8.com/ios/36/000000/whiteboard.png"
                    text="Blackboard"
                    hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/whiteboard.png"
                />
            </div>
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
            <Link to="/calendar">
                <SidebarItem
                    icon="https://img.icons8.com/fluent-systems-regular/48/000000/calendar--v1.png"
                    text="Calendar"
                    hoverIcon={calendar}
                />
            </Link>
            <SidebarItem
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/phone.png"
                text="Calls"
                hoverIcon={calls}
            />
            <SidebarItem
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/file.png"
                text="Files"
                hoverIcon={files}
            />
            <div className="sidebarItem">
                <MoreHorizIcon />
            </div>
        </div>
    )
}

export default Sidebar
