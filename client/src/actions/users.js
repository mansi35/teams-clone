import * as api from '../api/index';
import { FETCH_USERS, FETCH_USER } from '../constants/actionTypes';

export const getUsers = () => async (dispatch) => {
    try {
        const { data } = await api.getUsers();
        dispatch({ type: FETCH_USERS, payload: data })
    } catch (error) {
        console.log(error);
    }
}

export const getUser = (id) => async (dispatch) => {
    try {
        const { data } = await api.getUser(id);
        dispatch({ type: FETCH_USER, payload: data })
    } catch (error) {
        console.log(error);
    }
}