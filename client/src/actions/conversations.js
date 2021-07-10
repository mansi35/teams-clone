import { FETCH_CONVERSATIONS, FETCH_CONVERSATION, CREATE_CONVERSATION } from '../constants/actionTypes';
import * as api from '../api/index';

export const getConversations = () => async (dispatch) => {
    try {
        const { data } = await api.fetchConversations();
        dispatch({ type: FETCH_CONVERSATIONS, payload: data })
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const getConversation = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchConversation(id);
        dispatch({ type: FETCH_CONVERSATION, payload: data })
    } catch (error) {
        console.log(error.message);
    }
}

export const updateConversation = (value, id) => async (dispatch) => {
    try {
        const { data } = await api.updateConversation(value, id);
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const createConversation = (conversation) => async (dispatch) => {
    try {
        const { data } = await api.createConversation(conversation);
        dispatch({ type: CREATE_CONVERSATION, payload: data })
    } catch (error) {
        console.log(error.message);
    }
}
