import React from 'react';
import GitUserProfile from '../../components/GitUserProfile/GitUserProfile';
import GitUserRepos from '../../components/GitUserRepos/GitUserRepos';
import GithubSearch from '../../components/GithubSearch/GithubSearch';
import './Github.scss';

function Github() {
    return (
        <div className="github">
            <GithubSearch />
            <div className="github__profile">
                <GitUserProfile />
                <GitUserRepos />
            </div>
        </div>
    )
}

export default Github
