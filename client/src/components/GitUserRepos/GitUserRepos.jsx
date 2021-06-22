/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import GitUserRepo from '../GitUserRepo/GitUserRepo';
import { getRepos } from '../../api/github';
import './GitUserRepos.scss';

function GitUserRepos({ user }) {
    const [repos, setRepos] = useState([]);
    const [path, setPath] = useState([]);
    const [allrepos, setAllRepos] = useState(false)
    const [pathChanged, setPathChanged] = useState(false);
    const [fileName, setFileName] = useState('');

    async function fetchRepos() {
        const result = await getRepos(user);
        setRepos(result.items);
    }

    useEffect(() => {
        setRepos([]);
        if (user) {
            fetchRepos();
        }
    // eslint-disable-next-line
    }, [user]);

    const allRepos = () => {
        const repos = document.getElementsByClassName('userRepo');
        for(var i = 0; i < repos.length; i++) {
            repos[i].classList.remove('d-none');
        }
        setAllRepos(!allrepos);
        setPath([]);
    }

    const changePath = (i) => {
        setPath(path.slice(0, i+1));
        setPathChanged(!pathChanged);
    }

    if (repos.length !== 0) {
        return (
            <div className="userRepos">
                <div className="userRepos__options" id="repos__options">
                    <h5 className="active">Repos</h5>
                    <h5>Activity</h5>
                </div>
                {path.length > 0 ? 
                    <div className="userRepoDir__name">
                        <button onClick={allRepos}><h6>repos</h6></button>
                        {" / "}
                        {path.map((dir, i) => {
                            return (
                                <span className="userRepoDir__name" key={i}>
                                    <button onClick={() => {changePath(i)}}><h6>{dir}</h6></button>
                                    {" / "}
                                </span>
                            )
                        })}
                        {fileName}
                    </div>
                : null}
                {repos?.map((repo, i) => {
                    return (
                        <GitUserRepo key={i} user={user} repo={repo} setPath={setPath} allrepos={allrepos} pathChanged={pathChanged} path={path} setFileName={setFileName} />
                    )
                })}
            </div>
        )
    } else {
        return (
            null
        )
    }
}

export default GitUserRepos
