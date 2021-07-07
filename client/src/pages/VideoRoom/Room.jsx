import React from "react";
import './Room.scss'
import VideoCall from "../../components/Video/VideoCall";
import ChatRoom from "../../components/ChatRooms/ChatRoom";

const Room = () => {
    return (
        <div className="videoconference">
            <div className="videoroom">
                <VideoCall />
            </div>
            <div className="chat">
                <ChatRoom />
            </div>
        </div>
    );
};

export default Room;
