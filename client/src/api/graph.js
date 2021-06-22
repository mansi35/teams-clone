import { graphConfig } from "../authConfig";

export async function callMsGraph(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphMeEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function callMsGraphCalendar(accessToken) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append('Prefer','outlook.body-content-type="text"')

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch(graphConfig.graphCalendarEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function callMsGraphCreateEvent(accessToken, event) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", 'application/json');

    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(event)
    };

    return fetch(graphConfig.graphEventEndpoint, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function callMsGraphUpdateEvent(accessToken, event, id) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);
    headers.append("Content-Type", 'application/json');

    const options = {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(event)
    };

    return fetch(graphConfig.graphEventEndpoint+`/${id}`, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export async function callMsGraphDeleteEvent(accessToken, id) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "DELETE",
        headers: headers
    };

    return fetch(graphConfig.graphEventEndpoint+`/${id}`, options)
        .then(response => response.json())
        .catch(error => console.log(error));
}