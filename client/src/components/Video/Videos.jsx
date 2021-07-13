import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useUsers } from '../../contexts/VideoContext';
import VideoControls from './VideoControls';

const Videos = () => {

	const users = useUsers()[0];

	return (
		<div id='videos'>
			{users.length && users.map((user) => <Video key={user.uid} user={user} />)}
		</div>
	);

}

export const Video = ({ user }) => {
	const vidDiv = useRef(null);
	const [fullScreen, setFullScreen] = useState(false);

	const playVideo = () => {
		user.videoTrack.play(vidDiv.current);
	}

	const stopVideo = () => {
		user.videoTrack.stop();
	}

	const startScreen = (screenTrack) => {
		user.videoTrack.stop();
		screenTrack.play(vidDiv.current);
	}

	const stopScreen = (videoTrack) => {
		if (user.screenTrack) {
			user.screenTrack.stop();
		}
		videoTrack.play(vidDiv.current);
	}

	useEffect(() => {
		playVideo();
		return () => {
			stopVideo();
		}
	// eslint-disable-next-line
	}, []);

	const toggleFullScreen = (videoId) => {
		if (!fullScreen) {
			setFullScreen(true);
			document.getElementById(videoId).style.position = "fixed";
			document.getElementById(videoId).style.height = "95%";
			document.getElementById(videoId).style.width = "72%";
			document.getElementById(videoId).style.zIndex = "3";
			document.getElementById(`${videoId}_pin`).style.zIndex = "4";
		} else {
			setFullScreen(false);
			document.getElementById(videoId).style.position = "relative";
			document.getElementById(videoId).style.height = "100%";
			document.getElementById(videoId).style.width = "100%";
			document.getElementById(videoId).style.zIndex = "0";
			document.getElementById(`${videoId}_pin`).style.zIndex = "2";
		}
	}

	return (
		<div id={user.uid} className={`vid ${user.uid}`} ref={vidDiv} >
			{!user.video && !user.screen && <Avatar><p>{user.uid.split('$')[0].charAt(0)}</p></Avatar>}
			<IconButton onClick={() => {toggleFullScreen(user.uid)}}>
				<img id={`${user.uid}_pin`} src="https://img.icons8.com/ios-filled/50/484abd/pin3.png" className="pin_screen" alt="pin screen" />
			</IconButton>
			<h6>{user.uid.split('$')[0]}</h6>
			<VideoControls user={user} startScreen={startScreen} stopScreen={stopScreen} />
		</div>
	)
}


export default Videos
