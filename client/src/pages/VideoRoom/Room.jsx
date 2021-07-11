import React, { useState } from "react";
import './Room.scss'
import VideoCall from "../../components/Video/VideoCall";
import ChatRoom from "../../components/ChatRooms/ChatRoom";
import VideoSidebar from "../../components/Video/VideoSidebar";
import GitUserRepos from '../../components/GitUserRepos/GitUserRepos';
import GithubSearch from '../../components/GithubSearch/GithubSearch';
import '../../pages/Github/Github.scss';
import Blackboard from "../../components/Blackboard/Blackboard";

const Room = () => {
    const [user, setUser] = useState('');
    return (
        <div className="videoconference">
            <VideoSidebar />
            <div className="videochat">
                <VideoCall />
                <div id="github" className="d-none github">
                    <GithubSearch setUser={setUser} />
                    <div className="github__profile">
                        <GitUserRepos user={user} />
                    </div>
                </div>
                <div id="board" className="d-none">
                    <Blackboard />
                </div>
                <div className="chat">
                    <ChatRoom />
                </div>
            </div>
        </div>
    );
};

export default Room;
