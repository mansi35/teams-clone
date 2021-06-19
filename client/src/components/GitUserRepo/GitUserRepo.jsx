import React, { useEffect, useState } from 'react';
import { getFileContent, getForkedFrom, getRepoContent } from '../../github';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import './GitUserRepo.scss';

function GitUserRepo({ user, repo, setPath, allrepos, pathChanged, path, setFileName }) {
    const [repoContent, setRepoContent] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [folderContent, setFolderContent] = useState(null);
    const [forkedFrom, setForkedFrom] = useState(null);

    useEffect(() => {
        const fetchForkedFrom = async() => {
            if (repo.fork) {
                const from = await getForkedFrom(repo, user);
                setForkedFrom(from);
            }
        }
        fetchForkedFrom();
    }, [repo.fork, user, repo])

    useEffect(() => {
        setRepoContent(null);
        setFileContent(null);
        setFolderContent(null);
        const repos = document.getElementsByClassName('userRepo');
        for(var i = 0; i < repos.length; i++) {
            repos[i].classList.remove('d-none');
        }
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
    }

    async function getContent(filefolder) {
        if (filefolder.type === "file") {
            const result = await getFileContent(user, repo.name, filefolder.path);
            console.log(result);
            setFileContent(result);
            setFileName(filefolder.name);
        } else {
            setPath((prevPath => [...prevPath, filefolder.name]));
            const result = await getFileContent(user, repo.name, filefolder.path);
            setFolderContent(result);
        }
    }

    const convertToPdf = (content) => {
        return (
            <object>
                <embed id="pdfID" type="text/html" src={`data:application/pdf;base64,${content}`} style={{ width: "100%", height: "70vh" }} />
            </object>
        )
    }

    if (!repoContent) {
        return (
            <div className="userRepo">
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
            <div id="repoPdf">
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
        )
    } else if (folderContent) {
        return (
            <div className="userRepoContent">
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
        )
    } else {
        return (
            <div className="userRepoContent">
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
        )
    }
}

export default GitUserRepo
