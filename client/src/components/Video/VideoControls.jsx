import React, { useState } from 'react';
import { useClient, useUsers } from '../../contexts/VideoContext';
import AgoraRTC from 'agora-rtc-sdk-ng';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import camera from '../../assets/camera.svg';
import camerastop from '../../assets/camera-stop.svg';
import microphone from '../../assets/microphone.svg';
import microphonestop from '../../assets/microphone-stop.svg';
import hangup from '../../assets/hang-up.svg';

const VideoControls = ({ user, startScreen, stopScreen }) => {
    const [screenStart, setScreenStart] = useState(false);
	const setUsers = useUsers()[1]
	const rtc = useClient();

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
					return user;
				}));
			});
		}
		else if (type === 'video') {
		setUsers(prevUsers => {
			return prevUsers.map((user) => {
			if (user.uid === id) {
				user.client && rtc.current.localVideoTrack.setEnabled(!user.video);
				return { ...user, video: !user.video }
			}
			return user;
			})
		})
		}
	}

	const shareScreen = async (id, screenStart) => {
		if (!screenStart) {
			setScreenStart(true);
			await rtc.current.client.unpublish(rtc.current.localVideoTrack);
			await AgoraRTC.createScreenVideoTrack()
			.then((screenStream) => {
				rtc.current.localScreenTrack = screenStream;
				screenStream.on('track-ended', () => {
					screenStream.stop();
					shareScreen(user.uid, true);
				});
			});
			setUsers(prevUsers => {
				return prevUsers.map((user) => {
                    if (user.uid === id) {
                        return { ...user, screen: !user.screen, videoTrack: rtc.current.localScreenTrack }
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
                        return { ...user, videoTrack: rtc.current.localVideoTrack, screen: !user.screen }
                    }
				    return user
				});
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
                <div disabled={screenStart} className="options-div" onClick={() => user.client && shareScreen(user.uid, screenStart)}>
                    <ScreenShareIcon fontSize="large" className="video-options" />
                </div>
			}

			{user.client && 
				<span className="options-div" onClick={() => leaveChannel()}>
					<img className="video-options" src={hangup} alt="End call"/>
				</span>
			}
		</div>
	);
}

export default VideoControls
