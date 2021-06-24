import { CREATE_MESSAGE, FETCH_MESSAGES } from '../constants/actionTypes';
import * as api from '../api/index';

export const getEvents = (id) => async (dispatch) => {
    try {
        const { data } = await api.getMessages(id);
        dispatch({ type: FETCH_MESSAGES, payload: data })
    } catch (error) {
        console.log(error.message);
    }
}

export const createEvent = (message, id) => async (dispatch) => {
    try {
        const { data } = await api.sendMessage(message, id);
        dispatch({ type: CREATE_MESSAGE, payload: data })
    } catch (error) {
        console.log(error.message);
    }
}