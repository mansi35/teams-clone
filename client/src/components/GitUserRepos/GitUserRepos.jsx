import React from 'react';
import GitUserRepo from '../GitUserRepo/GitUserRepo';
import './GitUserRepos.scss';

function GitUserRepos() {
    return (
        <div className="userRepos">
            <div className="userRepos__options">
                <h5>Repos</h5>
                <h5>Activity</h5>
            </div>
            <GitUserRepo />
            <GitUserRepo />
            <GitUserRepo />
            <GitUserRepo />
        </div>
    )
}

export default GitUserRepos
