// const accessToken = "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";
const git_oauth = JSON.parse(localStorage.getItem('git_oauth'));

const headers = new Headers();
const accessToken = git_oauth?.accessToken;
const basic = `Basic ${btoa(accessToken)}`;

headers.append("Authorization", basic);

const options = {
    method: "GET",
    headers: headers
};

export async function getAccessToken(code) {
    const postOptions = {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: {
            client_id: 'f6099a354e555e602bcb',
            client_secret: '8dd4b232c1c24eff144904deca110b4797ff0ac3',
            code: code,
        },
    };
    const url =  `https://boiling-caverns-09167.herokuapp.com/https://github.com/login/oauth/access_token?client_id=f6099a354e555e602bcb&client_secret=8dd4b232c1c24eff144904deca110b4797ff0ac3&code=${code}`;
    return fetch(url, postOptions)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getUser(username) {
    const url = "https://api.github.com/users/" + username;
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getForkedFrom(i, username){
    const url =  "https://api.github.com/repos/" + username + "/" + i.name;
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getRepos(username) {
    const url =  `https://api.github.com/users/${username}/repos?sort=updated&per_page=1000`;
    // const url = `https://api.github.com/search/repositories?q=user:${username}&sort=updated`;
    const repoOptions = {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": `Basic ${btoa(accessToken)}`
        }
    };
    return fetch(url, repoOptions)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getRepoContent (username, reponame) {
    const url = "https://api.github.com/repos/"+ username + "/" + reponame + "/contents";
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getActivity(username) {
    const url = "https://api.github.com/users/" + username + "/events?per_page=1000";
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getFileContent(username, reponame, filefolderName) {
    const url = "https://api.github.com/repos/"+ username + "/" + reponame + "/contents/" + filefolderName;
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function GetRepoCommits(username, reponame) {
    const url = `https://api.github.com/repos/${username}/${reponame}/commits?sort=updated&per_page=100`;
    const commitOptions = {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": `Basic ${btoa(accessToken)}`
        }
    };
    return fetch(url, commitOptions)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function GetRepoIssues(username, reponame) {
    const url = `https://api.github.com/repos/${username}/${reponame}/issues?sort=created&per_page=100`;
    const issueOptions = {
        method: "GET",
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": `Basic ${btoa(accessToken)}`
        }
    };
    return fetch(url, issueOptions)
        .then(response => response.json())
        .catch(error => console.log(error));
}
