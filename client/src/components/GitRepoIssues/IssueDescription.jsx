import React, { useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import AdjustIcon from '@material-ui/icons/Adjust';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createIssueComments } from '../../api/github';
import rehypeRaw from 'rehype-raw'

const initialState = { body: '' };

function IssueDescription({ issue, setDescription, comments, setComments, user, repo }) {
    const [form, setForm] = useState(initialState);

    const backToIssues = () => {
        setDescription(false);
        const issues = document.getElementsByClassName('repo__issue');
        for(var i = 0; i < issues.length; i++) {
            issues[i].classList.remove('d-none');
        }
    }

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

    const postComment = async() => {
        const result = await createIssueComments(user, repo, issue.number, form);
        setComments([...comments, result]);
        console.log(result);
    }

    return (
        <div className="issue__description">
            <div className="issue__title">
                <h5>{issue.title}</h5>
                <div className="issue__state">
                    <div>
                        <AdjustIcon />
                        <p>{issue.state}</p>
                    </div>
                    <p>{issue.user.login} opened this issue {moment(issue.created_at).fromNow()} - {issue.comments} comments</p>
                </div>
            </div>
            <div className="issue__labels">
                {issue.labels.length !== 0 ?
                    <div>
                        <p>Labels</p>
                        <div className="issue__label">
                            {issue.labels.map((label, i) => {
                                return (
                                    <p style={{ backgroundColor: `#${label.color}`, color: lightOrDark('#' + label.color) === 'dark' ? "#ffffff" : "#000000" }}>{label.name}</p>
                                )
                            })}
                        </div>
                    </div>
                    :null}
            </div>
            <div className="issue__mainBody">
                <div className="issue__descriptionTitle">
                    <Avatar src={issue.user.avatar_url} />
                    <p>{issue.user.login} commented {moment(issue.created_at).fromNow()}</p>
                </div>
                <div className="issue__descriptionBody">
                    {issue.body === "" ?
                        <p><i>No description provided.</i></p>
                    :
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{issue.body}</ReactMarkdown>
                    }
                </div>
            </div>
            <div className="issue__comments">
                {comments.map((comment, i) => {
                    return (
                        <div className="issue__comment">
                            <div className="issue__commentTitle">
                                <Avatar src={comment.user.avatar_url} />
                                <p>{comment.user.login} commented {moment(comment.created_at).fromNow()}</p>
                            </div>
                            <ReactMarkdown rehypePlugins={[rehypeRaw]} className="issue__commentBody">{comment.body}</ReactMarkdown>
                        </div>
                    )
                })}
            </div>
            <CKEditor
                editor={ ClassicEditor }
                data="<p>Leave a comment</p>"
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setForm({ ...form, body: data })
                } }
            />
            <div className="issue__buttons">
                <Button variant="contained" color="primary" onClick={() => {backToIssues()}} className="submit">Back to Issues</Button>
                <Button variant="contained" color="primary" onClick={() => {postComment()}} className="submit">Comment</Button>
            </div>
        </div>
    )
}

export default IssueDescription
