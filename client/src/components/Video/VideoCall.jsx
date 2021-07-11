import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoProvider, useClient, useUsers } from '../../contexts/VideoContext';
import { useLocation, useParams } from 'react-router-dom';
import { v1 as uuid } from "uuid";
import Videos from './Videos';
import './VideoCall.scss';

const VideoCall = () => {
	return (
		<VideoProvider>
			<div id="video" className="video">
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
		initClientEvents();
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
				const remoteVideoTrack = user.videoTrack;
				console.log('recieving video');
				setUsers((prevUsers) => {
					return prevUsers.filter(User => User.uid !== user.uid)
				});
				setUsers((prevUsers) => {
					return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, screen: user.screen, client: false, videoTrack: remoteVideoTrack }]
				});
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
							if (!user.video) {
								return { ...User, video: !User.video }
							} else {
								return { ...User, screen: !User.screen }
							}
						}
						return User
					}));
				})
			}
		});
	}

	return (
		<div className="content">
			<Videos />
		</div>
	)
}

export default VideoCall;
