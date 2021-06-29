import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import io from "socket.io-client";
import './WatchPartyRoom.scss';

const WatchPartyRoom = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const socketRef = useRef();
    const { roomId } = useParams();

    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");
    }, []);

    useEffect(() => {
        if (roomId) {
            socketRef.current.emit("join room", {roomID: roomId, username: currentUser.result.name });
            socketRef.current.on('playVideo', () => {
                document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}','*');
            });

            socketRef.current.on('pauseVideo', () => {
                document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
            });

            socketRef.current.on('stopVideo', () => {
                document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');
            });
        }
        // eslint-disable-next-line
    }, [])

    const startVideo = () => {
        document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}','*');
        socketRef.current.emit('playVideo');
        console.log('I played');
    }
    
    const pauseVideo = (me) => {
        document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
        socketRef.current.emit('pauseVideo');
        console.log('I paused');
    }
    
    const stopVideo = (me) => {
        document.getElementsByClassName('youtube-video')[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}','*');
        socketRef.current.emit('stopVideo');
    }

    return (
        <div className="watchparty">
            <div className="container">
                <iframe title="yt" className="youtube-video" src="https://www.youtube-nocookie.com/embed/LrJbrydDf2s?enablejsapi=1&version=3&playerapiid=ytplayer&rel=0&playlist=LrJbrydDf2s&loop=1" modestbranding="0" controls="0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "93.1vh" }}></iframe>
                <div onClick={() => {console.log('hey')}} className="overlay"></div>
            </div>
            <div className="watchparty__buttons">
                <button className="play-video" onClick={() => {startVideo()}}>Play</button>
                <button className="pause-video" onClick={() => {pauseVideo()}}>Pause</button>
                <button className="stop-video" onClick={() => {stopVideo()}}>Stop</button>
            </div>
        </div>
    )
}

export default WatchPartyRoom
