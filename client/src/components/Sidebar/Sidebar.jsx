import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import './Sidebar.scss';
import SidebarItem from './SidebarItem';
import calendar from '../../assets/calendar.svg';
import activity from '../../assets/activity.svg';
import chat from '../../assets/chat.svg';
import teams from '../../assets/teams.svg';
import calls from '../../assets/calls.svg';
import files from '../../assets/files.svg';
import assignments from '../../assets/assignments.svg';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <SidebarItem 
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/appointment-reminders--v1.png"
                text="Activity"
                hoverIcon={activity}
            />
            <SidebarItem 
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/chat-message.png"
                text="Chat"
                hoverIcon={chat}
            />
            <SidebarItem 
                icon="https://img.icons8.com/windows/32/000000/microsoft-teams-2019.png"
                text="Teams"
                hoverIcon={teams}
            />
            <Link to="/git">
                <SidebarItem 
                    icon="https://img.icons8.com/ios/50/000000/backpack.png"
                    text="Assignments"
                    hoverIcon={assignments}
                />
            </Link>
            <SidebarItem 
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/calendar--v1.png"
                text="Calendar"
                hoverIcon={calendar}
            />
            <SidebarItem
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/phone.png"
                text="Calls"
                hoverIcon={calls}
            />
            <SidebarItem
                icon="https://img.icons8.com/fluent-systems-regular/48/000000/file.png"
                text="Files"
                hoverIcon={files}
            />
            <div className="sidebarItem">
                <MoreHorizIcon />
            </div>
        </div>
    )
}

export default Sidebar
