const headers = new Headers();
const accessToken = "c30baaa9c2b46d273bf0:718c040702fb459cb0189fe31fc90177e4f53a15";
const basic = `Basic ${btoa(accessToken)}`;

headers.append("Authorization", basic);

const options = {
    method: "GET",
    headers: headers
};

export async function getUser(username) {
    const url = "https://api.github.com/users/" + username;
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function getForkedFrom(i, username){
    const url =  "https://api.github.com/repos/" + username + "/" + i.name;
    const response = await fetch(url, options);
    const result = await response.json();  
    return result.parent.full_name;
}

export async function getRepos(username) {
    const url =  "https://api.github.com/users/" + username + "/repos?sort=updated&per_page=1000";
    return fetch(url, options)
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
