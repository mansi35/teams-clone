import { combineReducers } from "redux";

import auth from './auth';
import events from './events';

export const reducers =  combineReducers({ auth, events });