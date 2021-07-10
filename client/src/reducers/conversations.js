import { FETCH_CONVERSATIONS, FETCH_CONVERSATION, CREATE_CONVERSATION } from '../constants/actionTypes';

const conversationReducer = (state = { conversations: [] }, action) => {
    switch (action.type) {
        case FETCH_CONVERSATIONS:
            return  { ...state, conversations: action.payload };

        case FETCH_CONVERSATION:
            return  { ...state, conversation: action.payload };

        case CREATE_CONVERSATION:
            return { ...state, conversations: [...state.conversations, action.payload] };    

        default:
            return state;
    }
};

export default conversationReducer;

