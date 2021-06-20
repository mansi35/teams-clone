import React from 'react';
import './GitRepoIssues.scss';
import AdjustIcon from '@material-ui/icons/Adjust';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { Avatar } from '@material-ui/core';
import moment from 'moment';

function GitRepoIssues({ issue }) {
    return (
        <div className="repo__issues">
            <div className="issue__info">
                <div className="issue__title">
                    <AdjustIcon />
                    <h6>{issue.title}</h6>
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
                    <ChatBubbleOutlineIcon />
                    <p>{issue.comments}</p>
                </div>
            </div>
            <div className="issue__labels">
                {issue.labels?.map((label, i) => {
                    return (
                        <p style={{ backgroundColor: `#${label.color}` }}>{label.name}</p>
                    )
                })}
            </div>
            <div className="user__info">
                <p>#{issue.number} opened {moment(issue.created_at).fromNow()} by {issue.user.login}</p>
            </div>
        </div>
    )
}

export default GitRepoIssues
