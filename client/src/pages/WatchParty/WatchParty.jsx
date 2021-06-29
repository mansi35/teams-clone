import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import WatchPartyRoom from '../../components/WatchPartyRoom/WatchPartyRoom';
import './WatchParty.scss';

const WatchParty = () => {
    return (
        <div className="watchparty">
            <Sidebar />
            <WatchPartyRoom />
        </div>
    )
}

export default WatchParty
