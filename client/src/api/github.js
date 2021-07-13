import axios from 'axios';
const API = axios.create({ baseURL: 'https://api.github.com' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('git_oauth')) {
        req.headers.Authorization = `Basic ${btoa(JSON.parse(localStorage.getItem('git_oauth')).data.access_token)}`;
    }
    return req;
});

export const getAccessToken = (code) => axios.post('https://boiling-caverns-09167.herokuapp.com/https://github.com/login/oauth/access_token', {
    client_id: process.env.REACT_APP_GITHUB_CLIENTID,
    client_secret: process.env.REACT_APP_GITHUB_CLIENTSECRET,
    code: code,
}, {
    headers: {
        Accept: 'application/json'
    }
});

export const getUser = (username) => API.get(`/users/${username}`);

export const getForkedFrom = (repo, username) => API.get(`/repos/${username}/${repo.name}`);

export const getRepos = (username) => API.get(`/search/repositories?q=user:${username}&sort=updated&type=all`);

export const getRepoContent = (username, reponame) => API.get(`/repos/${username}/${reponame}/contents`);

export const getActivity = (username) => API.get(`/users/${username}/events?per_page=1000`);

export const getFileContent = (username, reponame, filefolderName) => API.get(`/repos/${username}/${reponame}/contents/${filefolderName}`);

export const getRepoCommits = (username, reponame) => API.get(`/repos/${username}/${reponame}/commits?sort=updated&per_page=100`);

export const getRepoIssues = (username, reponame) => API.get(`https://api.github.com/repos/${username}/${reponame}/issues?sort=created&per_page=100`);

export const getRepoIssueComments = (username, reponame, thread) => API.get(`https://api.github.com/repos/${username}/${reponame}/issues/${thread}/comments?sort=created&per_page=100`);

export const createIssues = (username, reponame, payLoad) => API.post(`https://api.github.com/repos/${username}/${reponame}/issues`, payLoad);

export const createIssueComments = (username, reponame, thread, payLoad) => API.post(`https://api.github.com/repos/${username}/${reponame}/issues/${thread}/comments`, payLoad);
