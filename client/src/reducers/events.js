import { FETCH_ALL, CREATE } from '../constants/actionTypes';

const eventReducer = (events = [], action) => {
    switch (action.type) {
        case FETCH_ALL:
            return action.payload;

        case CREATE:
            return [ ...events, action.payload ];

        default:
            return events;
    }
};

export default eventReducer;
