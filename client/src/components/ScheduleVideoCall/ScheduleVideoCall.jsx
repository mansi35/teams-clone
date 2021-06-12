import React from 'react'
import {ReactComponent as Calendar} from '../../assets/calendar.svg'
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './ScheduleVideoCall.scss'

const ScheduleVideoCall = () => {
    return (
        <div className="videocall">
            <div className="videocall__logo">
                <Calendar />
                <h5><b>Calendar</b></h5>
            </div>
            <div className="videocall__options">
                <button className="videocall__meetNow">
                    <img src="https://img.icons8.com/fluent-systems-regular/48/000000/video-call.png"/>
                    <b>Meet Now</b>
                </button>
                <div className="videocall__newMeeting">
                    <button className="videocall__new">
                        <AddIcon />
                        <b>New Meeting</b>
                    </button>
                    <button className="videocall__more">
                        <ExpandMoreIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ScheduleVideoCall
