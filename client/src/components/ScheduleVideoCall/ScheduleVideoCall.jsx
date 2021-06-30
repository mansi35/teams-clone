import React, { useEffect, useState } from 'react'
import {ReactComponent as Calendar} from '../../assets/calendar.svg'
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './ScheduleVideoCall.scss'
import { v1 as uuid } from "uuid";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEvent } from '../../actions/events';
import moment from 'moment';

const ScheduleVideoCall = ({ schedule }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [id, setId] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const create = () => {
        const meetingId = uuid();
        setId(meetingId);
        dispatch(createEvent({
            Subject: `Meeting on ${moment(new Date()).format("DD/MM/YYYY")}`,
            StartTime: new Date(),
            EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
            _id: meetingId,
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        }));
    }

    const scheduleMeeting = () => {
        let cellData = {
            startTime: new Date(),
            endTime: new Date(),
        };
        schedule.openEditor(cellData, 'Add');
    }

    return (
        <div className="videocall">
            <div className="videocall__logo">
                <Calendar />
                <h5><b>Calendar</b></h5>
            </div>
            <div className="videocall__options">
                <Link to={`/room/${id}`} target="_blank">
                    <button className="videocall__meetNow" onClick={create}>
                        <img src="https://img.icons8.com/fluent-systems-regular/48/000000/video-call.png" alt="" />
                        <b>Meet Now</b>
                    </button>
                </Link>
                <div className="videocall__newMeeting">
                        <button className="videocall__new" onClick={() => {scheduleMeeting()}}>
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
