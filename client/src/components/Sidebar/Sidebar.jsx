import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Sidebar.scss';
import SidebarItem from './SidebarItem';
import calendar from '../../assets/calendar.svg';
import activity from '../../assets/activity.svg';
import chat from '../../assets/chat.svg';
import teams from '../../assets/teams.svg';
import calls from '../../assets/calls.svg';
import files from '../../assets/files.svg';
import { Link, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../api/github';
import LoginGithub from 'react-login-github';

function Sidebar() {
    const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('git_oauth')));
    const location = useLocation();
  
    useEffect(() => {
        setAuth(JSON.parse(localStorage.getItem('git_oauth')));
    }, [location]);

    const onSuccess = async(response) => {
        const result = await getAccessToken(response.code);
        console.log(result);
        localStorage.setItem('git_oauth', JSON.stringify(result));
    }
    const onFailure = response => console.error(response);

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
            <SidebarItem 
                icon="https://img.icons8.com/windows/32/000000/microsoft-teams-2019.png"
                text="Teams"
                hoverIcon={teams}
            />
            {auth ?
                <Link to="/git">
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
                    <Link to="/git">
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
