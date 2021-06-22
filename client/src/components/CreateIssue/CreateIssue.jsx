import React, { useState } from 'react';
import Input from '../Auth/Input';
import { Button } from '@material-ui/core';
import { createIssues } from '../../github';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const initialState = { title: '', body: '' };

function CreateIssue({ user, repo, DoneIssue, setAllIssues, allIssues }) {
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const postIssue = async() => {
        if (form.title !== "") {
            const result = await createIssues(user, repo, form);
            DoneIssue();
            setAllIssues([result, ...allIssues])
        } else {
            document.getElementById("warning").innerHTML = '<p>*Title is mandatory</p>';
        }
    }

    return (
        <div>
            <Input name="title" label="Title" handleChange={handleChange} type="text" autofocus required />
            <CKEditor
                editor={ ClassicEditor }
                data="<p>Start an Issue</p>"
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setForm({ ...form, body: data })
                } }
            />
            <Button fullWidth variant="contained" color="primary" onClick={() => {postIssue()}} className="submit">Done</Button>
            <div id="warning"></div>
        </div>
    )
}

export default CreateIssue
