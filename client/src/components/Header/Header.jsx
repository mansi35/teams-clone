import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar, Button } from '@material-ui/core';
import { ReactComponent as Apps } from '../../assets/apps.svg'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../authConfig';
import './Header.scss'
import { callMsGraph } from '../../api/graph';

const Header = () => {
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const handleLogin = async (instance) => {
        instance.loginPopup(loginRequest)
        .then((data) => {
            const tokenId = data.accessToken;
            callMsGraph(tokenId).then((response) => {
                console.log(response);
                try {
                    dispatch({ type: 'AUTH' , data: { response, tokenId } });
                    history.push('/calendar');
                } catch (error) {
                    console.log('error')
                }
            });
        })
        .catch(e => {
            console.error(e);
        });
    }

    const logoutHandler = (instance) => {
        instance.logoutPopup()
        .then(() => {
            dispatch({ type: 'LOGOUT' });
            history.push('/auth');

            setUser(null);
        })
        .catch(e => {
            console.error(e);
        });
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
                {user && isAuthenticated ? (
                    <>
                    <h6>{user.data.displayName}</h6>
                    <div className="header__profile">
                    {user.data.displayName ?
                        <Avatar src={user.data.photoUrl} alt={user.data.displayName} onClick={() => logoutHandler(instance)}>{user.data.displayName.charAt(0)}</Avatar>
                    : null}
                    </div>
                    </>
                ) : (
                    <Button className="microsoft__login ml-auto" fullWidth variant="contained" onClick={() => handleLogin(instance)}>
                        <img src="https://img.icons8.com/color/48/000000/microsoft.png" alt="" />
                        Sign in
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Header
