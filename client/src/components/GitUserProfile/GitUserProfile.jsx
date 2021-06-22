import React, { useEffect, useState } from 'react';
import { getUser } from '../../github';
import './GitUserProfile.scss';

function GitUserProfile({ user }) {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        if (user) {
            async function fetchProfile() {
                const result = await getUser(user);
                console.log(result);
                setProfile(result);
            }
            fetchProfile();
        }
    }, [user])

    if (profile && !profile.message) {
    return (
        <div className="userProfile">
            <div className="username">
                <h3>{profile.name}</h3>
            </div>
            <div className="userPhotoUrl">
                <img src={profile.avatar_url} alt="" />
            </div>
            <div className="userStats">
                <h6>Public Repos: {profile.public_repos}</h6>
                <h6>Public Gists: {profile.public_gists}</h6>
                <h6>Followers: {profile.followers}</h6>
                <h6>Following: {profile.following}</h6>
            </div>
            <div className="userProfileInfo">
                <h6>Company: {profile.company}</h6>
                <h6>Website/blog: <a href={profile.blog} target="_blank" rel="noreferrer"><h6>{profile.blog}</h6></a></h6>
                <h6>Location: {profile.location}</h6>
                <h6>Member Since: {profile.created_at.substring(0, 10)}</h6>
            </div>
        </div>
    )} else { 
        return (
            null
        )
    }
}

export default GitUserProfile
