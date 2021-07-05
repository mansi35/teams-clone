import React, { useEffect, useRef, useState } from 'react';
import './Music.scss';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const Music = () => {
    const playerRef = useRef();
    const timelineRef = useRef();
    const playheadRef = useRef();
    const hoverPlayheadRef = useRef();
    const [currentTime, setCurrentTime] = useState('0:00');
    const [index, setIndex] = useState(3);
    const [pause, setPause] = useState(false);
    const musicList = [{name:'Nice piano and ukulele', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/buddy.jpg', audio:'https://www.bensound.com/bensound-music/bensound-buddy.mp3', duration: '2:02'}, 
    {name:'Gentle acoustic', author: 'Acoustic', img: 'https://www.bensound.com/bensound-img/sunny.jpg', audio:'https://www.bensound.com/bensound-music/bensound-sunny.mp3', duration: '2:20'},
    {name:'Corporate motivational', author: 'Corporate', img: 'https://www.bensound.com/bensound-img/energy.jpg', audio:'https://www.bensound.com/bensound-music/bensound-energy.mp3', duration: '2:59'},
    {name:'Slow cinematic', author: 'Royalty', img: 'https://www.bensound.com/bensound-img/slowmotion.jpg', audio:'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3', duration: '3:26'}]
    const [currentSong, setCurrentSong] = useState(musicList[index]);

    const changeCurrentTime = (e) => {
        const duration = playerRef.current.duration;
  
        const playheadWidth = timelineRef.current.offsetWidth;
        const offsetWidht = timelineRef.current.offsetLeft;
        const userClickWidht = e.clientX - offsetWidht;
       
        const userClickWidhtInPercent = (userClickWidht*100)/playheadWidth;
      
        playheadRef.current.style.width = userClickWidhtInPercent + "%";
        playerRef.current.currentTime = (duration * userClickWidhtInPercent)/100;
    }

    const hoverTimeLine = (e) => {
        const duration = playerRef.current.duration;
        
        const playheadWidth = timelineRef.current.offsetWidth
        
        const offsetWidht = timelineRef.current.offsetLeft;
        const userClickWidht = e.clientX - offsetWidht;
        const userClickWidhtInPercent = (userClickWidht*100)/playheadWidth;
      
        if(userClickWidhtInPercent <= 100){
          hoverPlayheadRef.current.style.width = userClickWidhtInPercent + "%";
        }
        
        const time = (duration * userClickWidhtInPercent)/100;
        
        if( (time >=0) && (time <= duration)){
          hoverPlayheadRef.current.dataset.content = formatTime(time);
        }
    }

    const resetTimeLine = () => {
        hoverPlayheadRef.current.style.width = 0;
    }
      
    const timeUpdate = () => {
        const duration = playerRef.current.duration;
        const playPercent = 100 * (playerRef.current.currentTime / duration);
        playheadRef.current.style.width = playPercent + "%";
        const currenttime = formatTime(parseInt(playerRef.current.currentTime));  
        setCurrentTime(currenttime)
    }
      
    const formatTime = (currentTime) => {
        const minutes = Math.floor(currentTime / 60);
        let seconds = Math.floor(currentTime % 60);
      
        seconds = (seconds >= 10) ? seconds : "0" + seconds % 60;
        
        const formatTime = minutes + ":" +  seconds
       
        return formatTime;
    }

    const updatePlayer = (key) => {
        const song = musicList[key];
        setCurrentSong(song);
        playerRef.current.load();
    }
      
    const nextSong = () => {
        setIndex((index + 1) % musicList.length);
        updatePlayer((index + 1) % musicList.length);
        if(pause){
          playerRef.current.play();
        }
    };
    
    const prevSong = () => {
        setIndex((index + musicList.length - 1) % musicList.length);
        updatePlayer((index + musicList.length - 1) % musicList.length);
        if(pause){
          playerRef.current.play();
        }
    };
       
    
    const playOrPause = () => {
        const song = musicList[index];
        setCurrentSong(song);
        if( !pause ){
            playerRef.current.play();
        } else{
          playerRef.current.pause();
        }
        setPause(!pause);
    }
      
    const clickAudio = (key) => {
        console.log('here');
        setIndex(key);
        
        updatePlayer(key);
        if(pause){
          playerRef.current.play();
        }
    }

    useEffect(() => {
        playerRef.current.addEventListener("timeupdate", timeUpdate, false);
        playerRef.current.addEventListener("ended", nextSong, false);
        timelineRef.current.addEventListener("click", changeCurrentTime, false);
        timelineRef.current.addEventListener("mousemove", hoverTimeLine, false);
        timelineRef.current.addEventListener("mouseout", resetTimeLine, false);
    });

    return (
        <div className="music">
            <div className="card">
            <div className="current-song">
            <audio ref={playerRef}>
                <source src={ currentSong.audio } type="audio/ogg"/>
                Your browser does not support the audio element.
            </audio>
            <div className="img-wrap">
                <img src={ currentSong.img } alt="" />
            </div>
            <span className="song-name">{ currentSong.name }</span>
            <span className="song-autor">{ currentSong.author }</span>
            
            <div className="time">
                <div className="current-time">{ currentTime }</div>
                <div className="end-time">{ currentSong.duration }</div>
            </div>
            
            <div ref={timelineRef} id="timeline">
                <div ref={playheadRef} id="playhead"></div>
                <div ref={hoverPlayheadRef} class="hover-playhead" data-content="0:00"></div>
            </div>
            
            <div className="controls">
                <button onClick={prevSong} className="prev prev-next current-btn"><SkipPreviousIcon /></button>
                
                <button onClick={playOrPause} className="play current-btn">
                {
                    (!pause) ? <PlayCircleFilledIcon />
                    :<PauseCircleFilledIcon />
                }
                </button>
                <button onClick={nextSong} className="next prev-next current-btn"><SkipNextIcon /></button>
            </div>
            
            </div>
            <div className="play-list" >
                {musicList.map( (music, key=0) =>
                    <div key={key} 
                    onClick={() => clickAudio(key)}
                    className={"track " + 
                        (index === key && !pause ?'current-audio':'') + 
                        (index === key && pause ?'play-now':'')} >
                    
                    <img className="track-img" src={music.img} alt="" />
                    <div className="track-discr" >
                        <span className="track-name" >{music.name}</span>
                        <span className="track-author" >{music.author}</span>
                    </div>
                    <span className="track-duration" >
                        {(index === key)
                            ?currentTime
                            :music.duration
                        }
                    </span>
                    </div>
                )}
            </div>
        </div>
      </div>
    )
}

export default Music
