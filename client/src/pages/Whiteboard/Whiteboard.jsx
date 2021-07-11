import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Blackboard from '../../components/Blackboard/Blackboard';
import './Whiteboard.scss';

const Whiteboard = () => {
    return (
        <div className="whiteboard">
            <Sidebar />
            <Blackboard />
        </div>
    )
}

export default Whiteboard
