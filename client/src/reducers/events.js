import { FETCH_ALL, CREATE, UPDATE, DELETE, FETCH_EVENT } from '../constants/actionTypes';

const eventReducer = (state = { events: [] }, action) => {
    switch (action.type) {
        case FETCH_ALL:
            return  { ...state, events: action.payload };

        case FETCH_EVENT:
            return  { ...state, event: action.payload };

        case CREATE:
            return { ...state, events: [...state.events, action.payload] };

        case UPDATE:
            return { ...state, events: state.events.map((event) => event._id === action.payload._id ? action.payload : event) };

        case DELETE:
            return { ...state, events: state.events.filter((event) => event._id !== action.payload) };

        default:
            return state;
    }
};

export default eventReducer;
