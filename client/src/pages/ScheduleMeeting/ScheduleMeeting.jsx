import React, { useEffect } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import CalendarJWT from '../../components/Calendar/CalendarJWT';
import Sidebar from '../../components/Sidebar/Sidebar';
import ScheduleVideoCall from '../../components/ScheduleVideoCall/ScheduleVideoCall';
import { useIsAuthenticated } from '@azure/msal-react';
import './ScheduleMeeting.scss';
import { useDispatch } from 'react-redux';
import { getEvents } from '../../actions/events';

const ScheduleMeeting = () => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);
    
    return (
        <div className="scheduleMeeting">
            <div className="schedule__content">
                <Sidebar />
                <div className="schedule__calendar">
                    <ScheduleVideoCall />
                    {isAuthenticated ?
                        <Calendar />
                    :
                        <CalendarJWT />
                    }
                </div>
            </div>
        </div>
    )
}

export default ScheduleMeeting
