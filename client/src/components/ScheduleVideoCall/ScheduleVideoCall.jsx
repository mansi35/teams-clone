import React, { useState } from 'react'
import {ReactComponent as Calendar} from '../../assets/calendar.svg'
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './ScheduleVideoCall.scss'
import { v1 as uuid } from "uuid";
import { Link } from 'react-router-dom';

const ScheduleVideoCall = () => {
    const [id, setId] = useState('');
    function create() {
        setId(uuid());
    }
    return (
        <div className="videocall">
            <div className="videocall__logo">
                <Calendar />
                <h5><b>Calendar</b></h5>
            </div>
            <div className="videocall__options">
                <button className="videocall__meetNow">
                    <img src="https://img.icons8.com/fluent-systems-regular/48/000000/video-call.png" alt="" />
                    <b>Meet Now</b>
                </button>
                <div className="videocall__newMeeting">
                    <Link to={`/room/${id}`} target="_blank">
                        <button className="videocall__new" onClick={create}>
                            <AddIcon />
                            <b>New Meeting</b>
                        </button>
                    </Link>
                    <button className="videocall__more">
                        <ExpandMoreIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ScheduleVideoCall
