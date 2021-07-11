import { useState, useRef, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoProvider, useClient, useUsers } from '../../contexts/VideoContext';
import { useLocation, useParams } from 'react-router-dom';
import './VideoCall.scss';
import { Avatar } from '@material-ui/core'
import { v1 as uuid } from "uuid";
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import camera from '../../assets/camera.svg'
import camerastop from '../../assets/camera-stop.svg'
import microphone from '../../assets/microphone.svg'
import microphonestop from '../../assets/microphone-stop.svg'
import hangup from '../../assets/hang-up.svg'

const VideoCall = () => {
	return (
		<VideoProvider>
			<div className="video">
				<Content />
			</div>
		</VideoProvider>
	);
}

const Content = () => {
	const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
	const setUsers = useUsers()[1];
	const rtc = useClient();
	const { roomId } = useParams();
	const options = {
		appId: "576de9875e7d4ffa81bb53d7baf96db3",
		channel: roomId,
		token: null,
	};
	const location = useLocation();

	useEffect(() => {
		setCurrentUser(JSON.parse(localStorage.getItem('profile')));
	}, [location]);

	useEffect(() => {
		init();
	// eslint-disable-next-line
	}, []);

	let init = async () => {
		rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
		const id = uuid();
		initClientEvents()
		const uid = await rtc.current.client.join(options.appId, options.channel, options.token, currentUser.result.name + '$' + id);
		rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
		rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
		setUsers((prevUsers) => {
			return [...prevUsers, { uid: uid, audio: true, video: true, screen: false, client: true, videoTrack: rtc.current.localVideoTrack, screenTrack: rtc.current.localScreenTrack }]
		})
		await rtc.current.client.publish([rtc.current.localAudioTrack, rtc.current.localVideoTrack]);
	}

	const initClientEvents = () => {
		rtc.current.client.on("user-left", (user) => {
			setUsers((prevUsers) => {
				return prevUsers.filter(User => User.uid !== user.uid);
			});
		});

		rtc.current.client.on("user-published", async (user, mediaType) => {
			await rtc.current.client.subscribe(user, mediaType);
			console.log(user);

			if (mediaType === "video") {
				if (!user.videoTrack) {
					const remoteScreenTrack = user.screenTrack;
					setUsers((prevUsers) => {
						return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, client: false, screenTrack: remoteScreenTrack }]
					});
				} else {
					const remoteVideoTrack = user.videoTrack;
					setUsers((prevUsers) => {
						return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, client: false, videoTrack: remoteVideoTrack }]
					});
				}
			}

			if (mediaType === "audio") {
				const remoteAudioTrack = user.audioTrack;
				remoteAudioTrack.play();
				setUsers((prevUsers) => {
					return (prevUsers.map((User) => {
						if (User.uid === user.uid) {
							return { ...User, audio: user.hasAudio }
						}
						return User
					}));
				});
			}
		});

		rtc.current.client.on("user-unpublished", (user, type) => {
			if (type === 'audio') {
				setUsers(prevUsers => {
					return (prevUsers.map((User) => {
						if (User.uid === user.uid) {
							return { ...User, audio: !User.audio }
						}
						return User
					}));
				})
			}
			if (type === 'video') {
				setUsers(prevUsers => {
					return (prevUsers.map((User) => {
						if (User.uid === user.uid) {
							return { ...User, video: !User.video }
						}
						return User
					}));
				})
			}
		});

		rtc.current.client.on('track-ended', () => {
			console.log('stopScreenSharing');
		});
	}

	return (
		<div className="content">
			<Videos />
		</div>
	)
}


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
		user.screenTrack.stop();
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
			{!user.video ? <Avatar><p>{user.uid.split('$')[0]?.charAt(0)}</p></Avatar>: null}
			<h6>{user.uid.split('$')[0]}</h6>
			<Controls user={user} startScreen={startScreen} stopScreen={stopScreen} />
		</div>
	)
}


export const Controls = ({ user, startScreen, stopScreen }) => {

	const [screenStart, setScreenStart] = useState(false);
	const setUsers = useUsers()[1]
	const rtc = useClient()

	const leaveChannel = async () => {
		await rtc.current.client.leave();
		setUsers([]);
		window.close();
	}

	const mute = (type, id) => {
		if (type === 'audio') {
		setUsers(prevUsers => {
			return (prevUsers.map((user) => {
			if (user.uid === id) {
				user.client && rtc.current.localAudioTrack.setEnabled(!user.audio)
				return { ...user, audio: !user.audio }
			}
			return user
			}))
		})
		}
		else if (type === 'video') {
		setUsers(prevUsers => {
			return prevUsers.map((user) => {
			if (user.uid === id) {
				user.client && rtc.current.localVideoTrack.setEnabled(!user.video)
				return { ...user, video: !user.video }
			}
			return user
			})
		})
		}
	}

	const shareScreen = async (id, screenStart) => {
		if (!screenStart) {
		setScreenStart(true);
		await rtc.current.client.unpublish(rtc.current.localVideoTrack);
		rtc.current.localScreenTrack = await AgoraRTC.createScreenVideoTrack();
		setUsers(prevUsers => {
			return prevUsers.map((user) => {
			if (user.uid === id) {
				user.client && rtc.current.localScreenTrack.setEnabled(!user.screen)
				return { ...user, video: !user.video, videoTrack: null, screen: !user.screen, screenTrack: rtc.current.localScreenTrack }
			}
			return user
			})
		});
		startScreen(rtc.current.localScreenTrack);
		await rtc.current.client.publish(rtc.current.localScreenTrack);
		} else {
		setScreenStart(false);
		await rtc.current.client.unpublish(rtc.current.localScreenTrack);
		rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
		setUsers(prevUsers => {
			return prevUsers.map((user) => {
			if (user.uid === id) {
				user.client && rtc.current.localVideoTrack.setEnabled(!user.video);
				return { ...user, video: !user.video, videoTrack: rtc.current.localVideoTrack, screen: !user.screen, screenTrack: null }
			}
			return user
			})
		});
		stopScreen(rtc.current.localVideoTrack);
		await rtc.current.client.publish(rtc.current.localVideoTrack);
		}
	}

	return (
		<div className={user.client ? 'controls me' : 'controls'}>
			{user.audio?
				<div className="options-div" onClick={() => user.client && mute('audio', user.uid)}>
					<img className="video-options" src={microphone} alt="Mute audio"/>
				</div>
			:
				<div className="options-div" onClick={() => user.client && mute('audio', user.uid)}>
					<img className="video-options" src={microphonestop} alt="Unmute audio"/>
				</div>
			}

			{user.client &&
				[user.video? (
					<div className="options-div" onClick={() => user.client && mute('video', user.uid)}>
						<img className="video-options" src={camera} alt="Mute video"/>
					</div>
				) : (
					<div className="options-div" onClick={() => user.client && mute('video', user.uid)}>
						<img className="video-options" src={camerastop} alt="Unmute video"/>
					</div>
				)]
			}

			{user.client &&
				[user.screen? (
					<div className="options-div" onClick={() => user.client && shareScreen(user.uid, screenStart)}>
						<ScreenShareIcon fontSize="large" className="video-options" />
					</div>
				) : (
					<div className="options-div" onClick={() => user.client && shareScreen(user.uid, screenStart)}>
						<ScreenShareIcon fontSize="large" className="video-options" />
					</div>
				)]
			}

			{user.client && 
				<span className="options-div" onClick={() => leaveChannel()}>
					<img className="video-options" src={hangup} alt="End call"/>
				</span>
			}
		</div>
	);
}

export default VideoCall;
