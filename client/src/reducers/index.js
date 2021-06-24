import { combineReducers } from "redux";

import auth from './auth';
import events from './events';
import users from './users';

export const reducers =  combineReducers({ auth, events, users });