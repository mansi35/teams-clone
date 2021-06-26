import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';

export const signin = (form, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(form);
        dispatch({ type: AUTH, data });
        history.push('/calendar');
    } catch (error) {
        console.log(error);
    }
}

export const signup = (form, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(form);
        dispatch({ type: AUTH, data });
        history.push('/calendar')
    } catch (error) {
        console.log(error);
    }
}

export const microsoftSignup = (form, data, history) => async (dispatch) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const { res } = await api.microsoftSignup(form);
        dispatch({ type: AUTH, data });
        history.push('/calendar')
    } catch (error) {
        console.log(error);
    }
}