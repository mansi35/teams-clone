import React, { useState } from 'react';
import Input from '../Auth/Input';
import { Button } from '@material-ui/core';
import { createIssues } from '../../github';

const initialState = { title: '', body: '' };

function CreateIssue({ user, repo }) {
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const postIssue = async() => {
        const result = await createIssues(user, repo, form);
        console.log(result);
    }

    return (
        <div>
            <Input name="title" label="Title" handleChange={handleChange} type="text" autofocus />
            <Input name="body" label="Description" handleChange={handleChange} type="text" />
            <Button fullWidth variant="contained" color="primary" onClick={() => {postIssue()}} className="submit">Done</Button>
        </div>
    )
}

export default CreateIssue
