import { FETCH_MESSAGES, CREATE_MESSAGE } from '../constants/actionTypes';

const messageReducer = (messages = [], action) => {
    switch (action.type) {
        case FETCH_MESSAGES:
            return action.payload;

        case CREATE_MESSAGE:
            return [ ...messages, action.payload ];

        default:
            return messages;
    }
};

export default messageReducer;
