import React, { useEffect, useState } from 'react';
import Calendar from '../../components/Calendar/Calendar';
import CalendarJWT from '../../components/Calendar/CalendarJWT';
import Sidebar from '../../components/Sidebar/Sidebar';
import ScheduleVideoCall from '../../components/ScheduleVideoCall/ScheduleVideoCall';
import { useIsAuthenticated } from '@azure/msal-react';
import './ScheduleMeeting.scss';
import { useDispatch } from 'react-redux';
import { getEvents } from '../../actions/events';
import { getUsers } from '../../actions/users';

const ScheduleMeeting = () => {
    const isAuthenticated = useIsAuthenticated();
    const dispatch = useDispatch();
    const [schedule, setSchedule] = useState();

    useEffect(() => {
        dispatch(getEvents());
        dispatch(getUsers());
    }, [dispatch]);
    
    return (
        <div className="scheduleMeeting">
            <div className="schedule__content">
                <Sidebar />
                <div className="schedule__calendar">
                    <ScheduleVideoCall schedule={schedule} />
                    {isAuthenticated ?
                        <Calendar />
                    :
                        <CalendarJWT setSchedule={setSchedule} />
                    }
                </div>
            </div>
        </div>
    )
}

export default ScheduleMeeting
