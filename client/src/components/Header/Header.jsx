import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar, Button } from '@material-ui/core';
import { ReactComponent as Apps } from '../../assets/apps.svg'
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import decode from 'jwt-decode';
import './Header.scss'

const Header = () => {
    const { instance } = useMsal();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logoutHandler();
            }
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    // eslint-disable-next-line
    }, [location]);

    const logoutHandler = (instance) => {
        if (instance) {
            instance.logoutPopup()
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                history.push('/auth');
                setUser(null);
            })
            .catch(e => {
                console.error(e);
            });
        } else {
            dispatch({ type: 'LOGOUT' });
            history.push('/auth');
            setUser(null);
        }
    }

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
                    <h6>{user.result.name}</h6>
                    <div className="header__profile">
                    {user.result.idTokenClaims?.sub ?
                        <Avatar src={user.result.photoUrl} alt={user.result.name} onClick={() => logoutHandler(instance)}>{user.result.name.charAt(0)}</Avatar>
                    : 
                        <Avatar src={user.result.photoUrl} alt={user.result.name} onClick={() => logoutHandler()}>{user.result.name.charAt(0)}</Avatar>
                    }
                    </div>
                    </>
                ):  <Link to="/auth">
                        <Button className="microsoft__login ml-auto" fullWidth variant="contained">
                            Sign in
                        </Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Header
