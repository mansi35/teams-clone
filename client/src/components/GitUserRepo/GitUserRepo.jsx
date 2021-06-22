import React, { useEffect, useState } from 'react';
import { getFileContent, getForkedFrom, GetRepoCommits, getRepoContent, GetRepoIssues } from '../../github';
import GitRepoCommits from '../GitRepoCommits/GitRepoCommits';
import GitRepoIssues from '../GitRepoIssues/GitRepoIssues';
import CreateIssue from '../CreateIssue/CreateIssue';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Button } from '@material-ui/core';
import './GitUserRepo.scss';

function GitUserRepo({ user, repo, setPath, allrepos, pathChanged, path, setFileName }) {
    const [repoContent, setRepoContent] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [folderContent, setFolderContent] = useState(null);
    const [forkedFrom, setForkedFrom] = useState(null);
    const [code, setCode] = useState(true);
    const [commits, setCommits] = useState(false);
    const [allCommits, setAllCommits] = useState([]);
    const [allIssues, setAllIssues] = useState([]);
    const [creatingIssue, setCreatingIssue] = useState(false);

    useEffect(() => {
        const fetchForkedFrom = async() => {
            if (repo.fork) {
                const from = await getForkedFrom(repo, user);
                setForkedFrom(from.full_name);
            }
        }
        fetchForkedFrom();
    // eslint-disable-next-line
    }, [repo.fork, repo])

    useEffect(() => {
        setRepoContent(null);
        setFileContent(null);
        setFolderContent(null);
        const repos = document.getElementsByClassName('userRepo');
        for(var i = 0; i < repos.length; i++) {
            repos[i].classList.remove('d-none');
        }
        document.getElementById('repos__options').classList.remove('d-none');
        setFileName('');
        setPath([]);
    // eslint-disable-next-line
    }, [user, allrepos]);

    const goBack = async(currentPath, repoName) => {
        if (path.length === 1) {
            const result = await getRepoContent(user, repoName);
            setRepoContent(result);
            setFileContent(null);
            setFolderContent(null);
            setFileName('');
        } else {
            const result = await getFileContent(user, repoName, currentPath);
            setFolderContent(result);
            setFileContent(null);
            setFileName('');
        }
    }

    useEffect(() => {
        if (path.length !== 0 && path[0] === repo.name) {
            let currentPath = '';
            const repoName = path[0];
            for (var i = 1; i < path.length; i++) {
                currentPath += path[i] + '/';
            }
            goBack(currentPath.slice(0, -1), repoName);
        }
    // eslint-disable-next-line
    }, [pathChanged])

    async function repoFiles(repoName) {
        setPath((prevPath => [...prevPath, repoName]));
        const result = await getRepoContent(user, repoName);
        setRepoContent(result);
        const repos = document.getElementsByClassName('userRepo');
        for(var i = 0; i < repos.length; i++) {
            repos[i].classList.add('d-none');
        }
        document.getElementById('repos__options').classList.add('d-none');
        repoCommits();
        repoIssues();
    }

    async function getContent(filefolder) {
        if (filefolder.type === "file") {
            const result = await getFileContent(user, repo.name, filefolder.path);
            setFileContent(result);
            setFileName(filefolder.name);
        } else {
            setPath((prevPath => [...prevPath, filefolder.name]));
            const result = await getFileContent(user, repo.name, filefolder.path);
            setFolderContent(result);
        }
    }

    async function repoCommits() {
        const result = await GetRepoCommits(user, repo.name);
        setAllCommits(result);
    }

    async function repoIssues() {
        const result = await GetRepoIssues(user, repo.name);
        console.log(result);
        setAllIssues(result);
    }

    const convertToPdf = (content) => {
        return (
            <object>
                <embed id="pdfID" type="text/html" src={`data:application/pdf;base64,${content}`} style={{ width: "100%", height: "70vh" }} />
            </object>
        )
    }

    const showCode = () => {
        setCode(true);
        setCommits(false);
    }

    const showCommits = () => {
        setCode(false);
        setCommits(true);
    }

    const showIssues = () => {
        setCode(false);
        setCommits(false);
    }

    const createIssue = () => {
        setCreatingIssue(true);
    }

    const CancelIssue = () => {
        setCreatingIssue(false);
    }

    const DoneIssue = () => {
        setCreatingIssue(false);
    }

    if (!repoContent) {
        return (
            <div className="userRepo" key={repo.id}>
                <div className="userRepo__name">
                    <button onClick={() => {repoFiles(repo.name)}}><h5>{repo.name}</h5></button>
                </div>
                {forkedFrom ?
                    <p className="userRepo__forkedFrom">Forked from {forkedFrom}</p>
                : null}
                <div className="userRepo__about">
                    <h6>{repo.description}</h6>
                </div>
                <div className="userRepo_stats">
                    <h6>Forks: {repo.forks_count}</h6>
                    <h6>Watchers: {repo.watchers_count}</h6>
                    <h6>Stars: {repo.stargazers_count}</h6>
                </div>
            </div>
        )
    } else if (fileContent) {
        return (
            <div key={repo.id}>
            {code ?
            <div className="repoPdf">
                <div className="userRepo__options">
                    <button onClick={showCode}><h6 className="repo__code active">Code</h6></button>
                    <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                    <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                </div>
                {fileContent.name.substring(fileContent.name.length-3,fileContent.name.length) === "pdf" ?
                <div>
                    {convertToPdf(fileContent.content)}
                </div>
                : <div>{
                    (fileContent.name.substring(fileContent.name.length-3,fileContent.name.length).toLowerCase() === "jpg"
                    || fileContent.name.substring(fileContent.name.length-3,fileContent.name.length).toLowerCase() === "png") ?
                        <img src={fileContent.download_url} alt="" style={{width: "100%"}} />
                    :<pre className="prettyprint">
                        {atob(fileContent.content)}
                    </pre>}
                </div>}
            </div>
            : [
                (commits ?
                    <div className="repoPdf">
                        <div className="userRepo__options">
                            <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                            <button onClick={showCommits}><h6 className="repo__commits active">Commits</h6></button>
                            <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                        </div>
                        {allCommits.map((commit, i) => {
                            return (
                                <GitRepoCommits commit={commit} />
                            )
                        })}
                    </div>
                    :
                    <div className="repoPdf">
                        <div className="userRepo__options">
                            <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                            <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                            <button onClick={showIssues}><h6 className="repo__issues active">Issues</h6></button>
                        </div>
                        <Button fullWidth variant="contained" color="primary" onClick={() => {createIssue()}} className="submit">Create Issue</Button>
                        {creatingIssue ?
                            <div>
                                <CreateIssue user={user} repo={repo.name} DoneIssue={DoneIssue} setAllIssues={setAllIssues} allIssues={allIssues} />
                                <Button fullWidth variant="contained" color="primary" onClick={() => {CancelIssue()}} className="submit">Cancel</Button>
                            </div>
                        :
                            <div>
                                {allIssues.map((issue, i) => {
                                    return (
                                        <GitRepoIssues issue={issue} user={user} repo={repo.name} />
                                    )
                                })}
                            </div>
                        }
                    </div>)
            ]}
            </div>
        )
    } else if (folderContent) {
        return (
            <div key={repo.id}>
            {code ?
            <div className="userRepoContent">
                <div className="userRepo__options">
                    <button onClick={showCode}><h6 className="repo__code active">Code</h6></button>
                    <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                    <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                </div>
                {folderContent.map((filefolder, i) => {
                    return (
                        <div className="userRepoContent__name">
                            {filefolder.type === "file" ?
                                <InsertDriveFileIcon style={{ fill: '#8fd8ff' }} />
                            : <FolderIcon style={{ fill: '#0097e9' }} />}
                            <button key={i} onClick={() => {getContent(filefolder)}}><h6>{filefolder.name}</h6></button>
                        </div>
                    )
                })}
            </div>
            : [
                (commits ?
                    <div className="userRepoContent">
                        <div className="userRepo__options">
                            <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                            <button onClick={showCommits}><h6 className="repo__commits active">Commits</h6></button>
                            <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                        </div>
                        {allCommits.map((commit, i) => {
                            return (
                                <GitRepoCommits commit={commit} />
                            )
                        })}
                    </div>
                :
                <div className="userRepoContent">
                    <div className="userRepo__options">
                        <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                        <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                        <button onClick={showIssues}><h6 className="repo__issues active">Issues</h6></button>
                    </div>
                    <Button fullWidth variant="contained" color="primary" onClick={() => {createIssue()}} className="submit">Create Issue</Button>
                    {creatingIssue ?
                        <div>
                            <CreateIssue user={user} repo={repo.name} DoneIssue={DoneIssue} setAllIssues={setAllIssues} allIssues={allIssues} />
                            <Button fullWidth variant="contained" color="primary" onClick={() => {CancelIssue()}} className="submit">Cancel</Button>
                        </div>
                    :
                        <div>
                            {allIssues.map((issue, i) => {
                                return (
                                    <GitRepoIssues issue={issue} user={user} repo={repo.name} />
                                )
                            })}
                        </div>
                    }
                </div>)
            ]}
            </div>
        )
    } else {
        return (
            <div key={repo.id}>
                {code ?
                    <div className="userRepoContent">
                        <div className="userRepo__options">
                            <button onClick={showCode}><h6 className="repo__code active">Code</h6></button>
                            <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                            <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                        </div>
                        {repoContent.map((filefolder, i) => {
                            return (
                                <div className="userRepoContent__name">
                                    {filefolder.type === "file" ?
                                        <InsertDriveFileIcon style={{ fill: '#8fd8ff' }} />
                                    : <FolderIcon style={{ fill: '#0097e9' }} />}
                                    <button key={i} onClick={() => {getContent(filefolder)}}><h6>{filefolder.name}</h6></button>
                                </div>
                            )
                        })}

                    </div>
                : [
                    (commits ?
                        <div className="userRepoContent">
                            <div className="userRepo__options">
                                <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                                <button onClick={showCommits}><h6 className="repo__commits active">Commits</h6></button>
                                <button onClick={showIssues}><h6 className="repo__issues">Issues</h6></button>
                            </div>
                            {allCommits.map((commit, i) => {
                                return (
                                    <GitRepoCommits commit={commit} />
                                )
                            })}
                        </div> 
                    : 
                    <div className="userRepoContent">
                        <div className="userRepo__options">
                            <button onClick={showCode}><h6 className="repo__code">Code</h6></button>
                            <button onClick={showCommits}><h6 className="repo__commits">Commits</h6></button>
                            <button onClick={showIssues}><h6 className="repo__issues active">Issues</h6></button>
                        </div>
                        <Button fullWidth variant="contained" color="primary" className="submit" onClick={() => {createIssue()}} >Create Issue</Button>
                        {creatingIssue ?
                            <div>
                                <CreateIssue user={user} repo={repo.name} DoneIssue={DoneIssue} setAllIssues={setAllIssues} allIssues={allIssues} />
                                <Button fullWidth variant="contained" color="primary" onClick={() => {CancelIssue()}} className="submit">Cancel</Button>
                            </div>
                        :
                            <div>
                                {allIssues.map((issue, i) => {
                                    return (
                                        <GitRepoIssues issue={issue} user={user} repo={repo.name} />
                                    )
                                })}
                            </div>
                        }
                    </div>)
                ]}
            </div>
        )
    }
}

export default GitUserRepo
