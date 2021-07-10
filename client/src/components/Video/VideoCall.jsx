import { useState, useRef, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoProvider, useClient, useUsers } from '../../contexts/VideoContext';
// import Slider from "react-slick";
import { useParams } from 'react-router-dom';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import './VideoCall.scss';

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
  const setUsers = useUsers()[1];
  const rtc = useClient();
  const { roomId } = useParams();
  const options = {
    appId: "576de9875e7d4ffa81bb53d7baf96db3",
    channel: roomId,
    token: null,
  };

  useEffect(() => {
      init();
  // eslint-disable-next-line
  }, [])

  let init = async () => {
    rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    initClientEvents()
    const uid = await rtc.current.client.join(options.appId, options.channel, options.token, null);
    rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    setUsers((prevUsers) => {
      return [...prevUsers, { uid: uid, audio: true, video: true, screen: false, client: true, videoTrack: rtc.current.localVideoTrack, screenTrack: rtc.current.localScreenTrack }]
    })
    await rtc.current.client.publish([rtc.current.localAudioTrack, rtc.current.localVideoTrack]);
  }

  const initClientEvents = () => {
    rtc.current.client.on("user-published", async (user, mediaType) => {
      await rtc.current.client.subscribe(user, mediaType);
      console.log(user, mediaType);

      if (mediaType === "video") {
        if (!user.videoTrack) {
          const remoteScreenTrack = user.screenTrack;
          setUsers((prevUsers) => {
            return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, client: false, screenTrack: remoteScreenTrack }]
          })
        } else {
          const remoteVideoTrack = user.videoTrack;
          setUsers((prevUsers) => {
            return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, client: false, videoTrack: remoteVideoTrack }]
  
          })
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
          }))

        })
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
          }))
        })
      }
      if (type === 'video') {
        setUsers((prevUsers) => {
          return prevUsers.filter(User => User.uid !== user.uid)
        })
      }
    });

    rtc.current.client.on('track-ended', () => {
      console.log('stopScreenSharing')
    });
  }

  return (
    <div className="content">
      <Videos />
    </div>
  )
}


const Videos = () => {

  const users = useUsers()[0]
  // const settings = {
  //   className: "center",
  //   infinite: true,
  //   centerPadding: "60px",
  //   speed: 500,
  //   rows: 3,
  //   slidesPerRow: 3,
  //   dots: true
  // };

  return (
    <div id='videos'>
      {users.length && users.map((user) => <Video key={user.uid} user={user} />)}
    </div>
  )

}

export const Video = ({ user }) => {
  // const [pin, setPin] = useState(false);
  const vidDiv = useRef(null);

  // const togglePinVideo = (id) => {
  //   const childNode = document.getElementsByClassName(`vid ${id}`)[0];
  //   if (!pin) {
  //     document.getElementById(`${id}`).style.display = "none";
  //     document.getElementById('pinned__video').appendChild(childNode);
  //     document.getElementById('videos').style.width = "25%";
  //     document.getElementById('pinned__video').style.width = "75%";
  //   } else {
  //     document.getElementById(`${id}`).style.display = "inline-block";
  //     document.getElementById('videos').style.width = "100%";
  //     document.getElementById('pinned__video').style.width = "0%";
  //     document.getElementById('pinned__video').removeChild(childNode);
  //   }
  //   setPin(!pin);
  // }

  const playVideo = () => {
    user.videoTrack.play(vidDiv.current)
  }

  const stopVideo = () => {
    user.videoTrack.stop()
  }

  const startScreen = (screenTrack) => {
    user.videoTrack.stop()
    screenTrack.play(vidDiv.current);
  }

  const stopScreen = (videoTrack) => {
    user.screenTrack.stop()
    videoTrack.play(vidDiv.current)
  }

  useEffect(() => {
    playVideo()
    return () => {
      stopVideo()
    }
  // eslint-disable-next-line
  }, [])

  return (
    <div id={user.uid} className={`vid ${user.uid}`} ref={vidDiv} >
      <img src="https://img.icons8.com/material-outlined/24/000000/pin.png" className="pin__screen" alt="pin screen" />
      <Controls user={user} startScreen={startScreen} stopScreen={stopScreen} />
    </div>
  )
}


export const Controls = ({ user, startScreen, stopScreen }) => {

  const [screenStart, setScreenStart] = useState(false);
  const setUsers = useUsers()[1]
  const rtc = useClient()

  const leaveChannel = async () => {
    await rtc.current.localAudioTrack.close();
    await rtc.current.localVideoTrack.close();
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
            user.client && rtc.current.localVideoTrack.setEnabled(!user.video)
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
    <div className='controls'>
      {<p className={user.audio ? 'on' : ''} onClick={() => user.client && mute('audio', user.uid)}>Mic</p>}
      {<p className={user.video ? 'on' : ''} onClick={() => user.client && mute('video', user.uid)}>Video</p>}
      {<p className={user.screen ? 'on' : ''} onClick={() => user.client && shareScreen(user.uid, screenStart)}>Screen</p>}
      {user.client && <p onClick={() => leaveChannel()}>Quit</p>}
    </div>
  )
}

export default VideoCall;
