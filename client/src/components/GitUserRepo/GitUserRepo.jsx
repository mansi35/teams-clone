import React from 'react';
import './GitUserRepo.scss';

function GitUserRepo() {
    return (
        <div className="userRepo">
            <div className="userRepo__name">
                <h5>Data-Structures-Algorithms</h5>
            </div>
            <div className="userRepo__about">
                <h6>Coding programs in different languages (C, C++ and Python)</h6>
            </div>
            <div className="userRepo_stats">
                <h6>Forks: 0</h6>
                <h6>Watchers: 0</h6>
                <h6>Stars: 0</h6>
            </div>
        </div>
    )
}

export default GitUserRepo
