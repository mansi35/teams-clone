import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const signIn = (profile) => API.post('/user/signin', profile);
export const signUp = (profile) => API.post('/user/signup', profile);
export const microsoftSignup = (profile) => API.post('/user/microsoftsignup', profile);

export const fetchEvent = (id) => API.get(`/events/${id}`)
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, event) => API.patch(`/events/${id}`, event);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const getUsers = () => API.get('/users');
export const getUsersBySearch = (searchQuery) => API.get(`/users/search?searchQuery=${searchQuery}`);

export const sendMessage = (message, id) => API.post(`/events/${id}/eventMsg`, message);
