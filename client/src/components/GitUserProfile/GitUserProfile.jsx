import React from 'react';
import './GitUserProfile.scss';

function GitUserProfile() {
    return (
        <div className="userProfile">
            <div className="username">
                <h3>Mansi Sharma</h3>
            </div>
            <div className="userPhotoUrl">
                <img src="https://avatars.githubusercontent.com/u/53896251?v=4" alt="" />
            </div>
            <div className="userStats">
                <h6>Public Repos: 12</h6>
                <h6>Public Gists: 0</h6>
                <h6>Followers: 4</h6>
                <h6>Following: 4</h6>
            </div>
            <div className="userProfileInfo">
                <h6>Comapny: @REMOVirtual</h6>
                <h6>Website/blog:</h6>
                <h6>Location: Delhi</h6>
                <h6>Member Since: 2019-08-08</h6>
            </div>
        </div>
    )
}

export default GitUserProfile
