import { Avatar } from '@material-ui/core';
import React, { useEffect, useRef } from 'react'
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

	return (
		<div id={user.uid} className={`vid ${user.uid}`} ref={vidDiv} >
			{!user.video && !user.screen && <Avatar><p>{user.uid.split('$')[0].charAt(0)}</p></Avatar>}
			<h6>{user.uid.split('$')[0]}</h6>
			<VideoControls user={user} startScreen={startScreen} stopScreen={stopScreen} />
		</div>
	)
}


export default Videos
