/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEvent, deleteEventByCreatorIdDate, getEvents, updateEventByCreatorIdDate } from '../actions/events';
import moment from 'moment';
import { v1 as uuid } from "uuid";
import { fetchEventByCreatorIdDate } from '../api';

const UseAlan = () => {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('profile')));
    // const { event } = useSelector(state => state.events);
    const dispatch = useDispatch();
    const location = useLocation();
    const [alanInstance, setAlanInstance] = useState();

    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const navigate = useCallback(({ detail: payload }) => {
            history.push(`/${payload}`);
    }, [alanInstance])

    const meetNow = useCallback(() => {
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
    }, [alanInstance])

    const scheduleMeeting = useCallback(({ detail: payload }) => {
        const meetingId = uuid();
        dispatch(createEvent({
            _id: meetingId,
            Subject: payload.subject,
            StartTime: new Date(new Date(payload.date).getTime() + payload.time*1000),
            EndTime: new Date(new Date(payload.date).getTime() + payload.time*1000 + 3600*1000),
            Creator: currentUser.result.name,
            CreatorId: currentUser.result._id,
        })).then(() => {
            dispatch(getEvents());
        });
    }, [alanInstance]);

    const updateMeeting = useCallback(async ({ detail: payload }) => {
        console.log(new Date(new Date(payload.date).getTime() + payload.time*1000), new Date(new Date(payload.updatedDate).getTime() + payload.updatedTime*1000));
        const { data } = await fetchEventByCreatorIdDate(new Date(new Date(payload.date).getTime() + payload.time*1000));

        if (!data) {
            alanInstance.playText(`Sorry, there is no meeting scheduled on ${payload.dateValue} at ${payload.timeValue}`);
        } else {
            alanInstance.playText(`Absolutely! (Updating|Changing) (meeting|appointment|event) scheduled on ${payload.dateValue} at ${payload.timeValue} to ${payload.updatedDateValue} at ${payload.updatedTimeValue}`);
            dispatch(updateEventByCreatorIdDate(new Date(new Date(payload.date).getTime() + payload.time*1000), 
                { 
                    StartTime: new Date(new Date(payload.updatedDate).getTime() + payload.updatedTime*1000).toISOString(),
                    EndTime: new Date(new Date(payload.updatedDate).getTime() + payload.updatedTime*1000 + new Date(data.EndTime).getTime() - new Date(data.StartTime).getTime()).toISOString(),
                }
            ));
        }
    }, [alanInstance])

    const deleteMeeting = useCallback(({ detail: payload }) => {
        dispatch(deleteEventByCreatorIdDate(new Date(new Date(payload.date).getTime() + payload.time*1000)));
    }, [alanInstance])

    useEffect(() => {
        window.addEventListener("meet now", meetNow);
        window.addEventListener("delete meeting", deleteMeeting);
        window.addEventListener("update meeting", updateMeeting);
        window.addEventListener("schedule meeting", scheduleMeeting);
        window.addEventListener("navigate", navigate);

        return () => {
          window.removeEventListener("meet now", meetNow);
          window.removeEventListener("delete meeting", deleteMeeting);
          window.removeEventListener("update meeting", updateMeeting);
          window.removeEventListener("schedule meeting", scheduleMeeting);
          window.removeEventListener("navigate", navigate);
        }
    }, [meetNow, deleteMeeting, updateMeeting, scheduleMeeting, navigate]);

    useEffect(() => {
        if (alanInstance != null) return;

        setAlanInstance(alanBtn({
            key: process.env.REACT_APP_ALAN_KEY,
            onCommand: ({ command, payload }) => {
                window.dispatchEvent(new CustomEvent(command, { detail: payload }));
            }
        }));
    }, []);

    return null;
}

export default UseAlan
