import React from 'react'
import Calendar from '../../components/Calendar/Calendar'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import './ScheduleMeeting.scss'

function ScheduleMeeting() {
    return (
        <div className="scheduleMeeting">
            <Header />
            <div className="schedule__content">
                <Sidebar />
                <Calendar />
            </div>
        </div>
    )
}

export default ScheduleMeeting
