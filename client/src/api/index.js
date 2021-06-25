import axios from 'axios';

const API = axios.create({ baseURL: 'https://teams-clone-server.herokuapp.com' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const signIn = (profile) => API.post('/user/signin', profile);
export const signUp = (profile) => API.post('/user/signup', profile);

export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, event) => API.patch(`/events/${id}`, event);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`/users/${id}`);

export const getMessages = (id) => API.get(`/users/${id}`);
export const sendMessage = (message, id) => API.post(`/users/${id}`, message);
