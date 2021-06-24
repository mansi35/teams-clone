import { FETCH_USER, FETCH_USERS } from '../constants/actionTypes';

const userReducer = (users = [], action) => {
    switch (action.type) {
        case FETCH_USERS:
            return action.payload;

        case FETCH_USER:
            return action.payload;

        default:
            return users;
    }
};

export default userReducer;
