import React from 'react';
import './GitRepoCommits.scss';
import { Avatar } from '@material-ui/core';
import moment from 'moment';

function GitRepoCommits({ commit }) {
    return (
        <div className="repo__commit">
            <h6>{commit.commit.message}</h6>
            <div className="committer__profile">
                <Avatar src={commit.author?.avatar_url} />
                <p>{commit.author ? commit.author.login: commit.commit.committer.name}</p>
                <p>committed {moment(commit.commit.committer.date).fromNow()}</p>
            </div>
        </div>
    )
}

export default GitRepoCommits
