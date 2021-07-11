import React, { useEffect, useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import '../Sidebar/Sidebar.scss';
import SidebarItem from '../Sidebar/SidebarItem';
import { useLocation } from 'react-router-dom';
import { getAccessToken } from '../../api/github';
import LoginGithub from 'react-login-github';

const VideoSidebar = () => {
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

    const close = (id) => {
        var element = document.getElementById(id);
        element.classList.add("d-none");
    }
    
    
    const open = (id) => {
        var element = document.getElementById(id);
        element.classList.remove("d-none");
    }

    const openGitHub = () => {
        close("video");
        close("board");
        open("github");
    }

    const openVideo = () => {
        close("github");
        close("board");
        open("video");
    }

    const openBoard = () => {
        close("github");
        close("video");
        open("board");
    }

    return (
        <div className="sidebar">
            <div onClick={() => {openVideo()}}>
                <SidebarItem 
                    icon="https://img.icons8.com/ios/36/000000/video-conference.png"
                    text="Video"
                    hoverIcon="https://img.icons8.com/ios/36/6264A7/video-conference.png"
                />
            </div>
            <div onClick={() => {openGitHub()}}>
            {auth ?
                <SidebarItem 
                    icon="https://img.icons8.com/ios/36/000000/github--v1.png"
                    text="GitHub"
                    hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/github.png"
                />
            :
                <LoginGithub clientId="f6099a354e555e602bcb"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    scope="admin:org repo user"
                    className="auth__button"
                >
                    <SidebarItem
                        icon="https://img.icons8.com/ios/36/000000/github--v1.png"
                        text="GitHub"
                        hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/github.png"
                    />
                </LoginGithub>
            }
            </div>
            <div onClick={() => {openBoard()}}>
                <SidebarItem 
                    icon="https://img.icons8.com/ios/36/000000/whiteboard.png"
                    text="Blackboard"
                    hoverIcon="https://img.icons8.com/ios-filled/36/6264A7/whiteboard.png"
                />
            </div>
            <div>
                <SidebarItem 
                    icon="https://img.icons8.com/ios-glyphs/36/000000/user-group-man-man.png"
                    text="Copy Invite"
                    hoverIcon="https://img.icons8.com/ios-glyphs/36/6264A7/user-group-man-man.png"
                />
            </div>
            <div className="sidebarItem">
                <MoreHorizIcon />
            </div>
        </div>
    )
}

export default VideoSidebar
