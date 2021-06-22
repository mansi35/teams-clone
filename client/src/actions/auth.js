import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';

export const signin = (form, history) => async (disptach) => {
    try {
        // log in the user
        history.push('/calendar')
    } catch (error) {
        console.log(error);
    }
}

export const signup = (form, history) => async (disptach) => {
    try {
        // sign up the user
        history.push('/calendar')
    } catch (error) {
        console.log(error);
    }
}