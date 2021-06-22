import React, { useState } from 'react';
import './GitRepoIssues.scss';
import AdjustIcon from '@material-ui/icons/Adjust';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import IssueDescription from './IssueDescription';
import { GetRepoIssueComments } from '../../github';

function GitRepoIssues({ issue, user, repo }) {
    const [description, setDescription] = useState(false);
    const [comments, setComments] = useState([]);
    const lightOrDark = (color) => {
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        const r = color >> 16;
        const g = (color >> 8) & 255;
        const b = color & 255;
        
        const hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );
        if (hsp > 127.5) {
            return 'light';
        } 
        else {
            return 'dark';
        }
    }

    const viewDescription = async() => {
        setDescription(true);
        const issues = document.getElementsByClassName('repo__issue');
        for(var i = 0; i < issues.length; i++) {
            issues[i].classList.add('d-none');
        }
        const result = await GetRepoIssueComments(user, repo, issue.number);
        console.log(result);
        setComments(result);
    }

    return (
        <div>
            {description ?
                <IssueDescription issue={issue} setDescription={setDescription} comments={comments} setComments={setComments} user={user} repo={repo} />
            :
            <div className="repo__issue">
                <div className="issue__info">
                    <div className="issue__title">
                        <AdjustIcon />
                        <button onClick={viewDescription}><h6>{issue.title}</h6></button>
                    </div>
                    <div className="issue__activity">
                        {issue.assignee ?
                            <div className="issue__assignees">
                            {issue.assignees?.map((assignee, i) => {
                                return (
                                    <Avatar src={assignee.avatar_url} />
                                )
                            })}
                            </div>
                        : null}
                        {issue.comments > 0 ?
                            <div className="issue__comments">
                                <ChatBubbleOutlineIcon />
                                <p>{issue.comments}</p>
                            </div>
                        : null}
                    </div>
                </div>
                <div className="issue__labels">
                    {issue.labels?.map((label, i) => {
                        return (
                            <p style={{ backgroundColor: `#${label.color}`, color: lightOrDark('#' + label.color) === 'dark' ? "#ffffff" : "#000000" }}>{label.name}</p>
                        )
                    })}
                </div>
                <div className="user__info">
                    <p>#{issue.number} opened {moment(issue.created_at).fromNow()} by {issue.user.login}</p>
                </div>
            </div>
            }
        </div>
    )
}

export default GitRepoIssues
