import React from 'react'
import Calendar from '../../components/Calendar/Calendar'
import Sidebar from '../../components/Sidebar/Sidebar'
import ScheduleVideoCall from '../../components/ScheduleVideoCall/ScheduleVideoCall'
import './ScheduleMeeting.scss'

function ScheduleMeeting() {
    return (
        <div className="scheduleMeeting">
            <div className="schedule__content">
                <Sidebar />
                <div className="schedule__calendar">
                    <ScheduleVideoCall />
                    <Calendar />
                </div>
            </div>
        </div>
    )
}

export default ScheduleMeeting
