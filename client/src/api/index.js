import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const signIn = (profile) => API.post('/user/signin', profile);

export const signUp = (profile) => API.post('/user/signup', profile);