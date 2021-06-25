import React, { useState } from 'react';
import GitUserProfile from '../../components/GitUserProfile/GitUserProfile';
import GitUserRepos from '../../components/GitUserRepos/GitUserRepos';
import GithubSearch from '../../components/GithubSearch/GithubSearch';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Github.scss';

function Github() {
    const [user, setUser] = useState('');
    return (
        <div className="git">
            <Sidebar />
            <div className="github">
                <GithubSearch setUser={setUser} />
                <div className="github__profile">
                    <GitUserProfile user={user} />
                    <GitUserRepos user={user} />
                </div>
            </div>
        </div>
    )
}

export default Github
