import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar } from '@material-ui/core';
import {ReactComponent as Apps} from '../../assets/apps.svg'
import './Header.scss'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const logoutHandler = () => {
        dispatch({ type: 'LOGOUT' });
        history.push('/');

        setUser(null);
    };

    return (
        <div className="header">
            <div className="header__logo">
                <Apps />
                <h5 className="d-none d-md-block">Microsoft Teams</h5>
            </div>
            {user ?
                <div className="header__search">
                    <SearchIcon />
                    <input type="text" placeholder="Search" />
                </div>
            : null}
            <div className="header__options">
                <MoreHorizIcon />
                {user ? (
                    <>
                    <h6>{user.data.displayName}</h6>
                    <div className="header__profile">
                    {user.data.displayName ?
                        <Avatar src={user.data.photoUrl} alt={user.data.displayName} onClick={() => {logoutHandler()}}>{user.data.displayName.charAt(0)}</Avatar>
                    : null}
                    </div>
                    </>
                ) : (
                    null
                )}
            </div>
        </div>
    )
}

export default Header
