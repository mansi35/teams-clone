import React from "react";
import './Room.scss'
import VideoCall from "../../components/Video/VideoCall";
import ChatRoom from "../../components/ChatRooms/ChatRoom";
import Sidebar from "../../components/Sidebar/Sidebar";

const Room = () => {
    return (
        <div className="videoconference">
            <Sidebar />
            <div className="videochat">
                <div className="videoroom">
                    <VideoCall />
                </div>
                <div className="chat">
                    <ChatRoom />
                </div>
            </div>
        </div>
    );
};

export default Room;
