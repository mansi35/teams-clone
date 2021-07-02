import { useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEvent, getEvents } from '../actions/events';
import moment from 'moment';
import { v1 as uuid } from "uuid";

const UseAlan = () => {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const meetNow = () => {
        const meetingId = uuid();
        dispatch(createEvent({
            Subject: `Meeting on ${moment(new Date()).format("DD/MM/YYYY")}`,
            StartTime: new Date(),
            EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
            _id: meetingId,
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        }));
        window.open(`/room/${meetingId}`, `_blank`);
    }

    const scheduleMeeting = (meeting) => {
        console.log(meeting);
        const meetingId = uuid();
        dispatch(createEvent({
            _id: meetingId,
            Subject: meeting.subject,
            StartTime: new Date(new Date(meeting.date).getTime() + meeting.time*1000),
            EndTime: new Date(new Date(meeting.date).getTime() + meeting.time*1000 + 3600*1000),
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        })).then(() => {
            dispatch(getEvents());
        });
    }

    useEffect(() => {
        alanBtn({
            key: process.env.REACT_APP_ALAN_KEY,
            onCommand: ({ command, scheduledMeeting }) => {
                if (command === "calendar") {
                    history.push('/calendar');
                } else if (command === "github") {
                    history.push('/git');
                } else if (command === "chat") {
                    history.push('/chat');
                } else if (command === "meet now") {
                    meetNow();
                } else if (command === "schedule meeting") {
                    scheduleMeeting(scheduledMeeting)
                }
            }
        });
    // eslint-disable-next-line
    }, []);

    return null;
}

export default UseAlan
