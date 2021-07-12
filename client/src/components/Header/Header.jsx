import React, { useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar, Button } from '@material-ui/core';
import { ReactComponent as Apps } from '../../assets/apps.svg'
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import decode from 'jwt-decode';
import './Header.scss'

const Header = () => {
    const { instance } = useMsal();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);

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
        if (user.result.idTokenClaims?.sub) {
            instance.logoutPopup()
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                history.push('/');
                setUser(null);
            })
            .catch(e => {
                console.error(e);
            });
        } else {
            dispatch({ type: 'LOGOUT' });
            history.push('/');
            setUser(null);
        }
        setAnchorEl(null);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                    <h6>{user.result.name}</h6>
                    <div className="header__profile">
                        {user.result.idTokenClaims?.sub ?
                            <div>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                    <Avatar src={user.result.photoUrl} alt={user.result.name}>{user.result.name.charAt(0)}</Avatar>
                                </Button>
                                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => {handleClose()}}>
                                    <MenuItem onClick={() => {logoutHandler(instance)}}>Logout</MenuItem>
                                </Menu>
                            </div>
                        : 
                            <div>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                                    <Avatar src={user.result.photoUrl} alt={user.result.name}>{user.result.name.charAt(0)}</Avatar>
                                </Button>
                                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => {handleClose()}}>
                                    <MenuItem onClick={() => {logoutHandler()}}>Logout</MenuItem>
                                </Menu>
                            </div>
                        }
                    </div>
                    </>
                ):  <Link to="/">
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
