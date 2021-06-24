import { combineReducers } from "redux";

import auth from './auth';
import events from './events';
import users from './users';
import messages from './messages';

export const reducers =  combineReducers({ auth, events, users, messages });