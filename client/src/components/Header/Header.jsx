import React, { useEffect, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar, Button } from '@material-ui/core';
import {ReactComponent as Apps} from '../../assets/apps.svg'
import './Header.scss'
import { Link } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    console.log(user);

    useEffect(() => {
        const token = user?.tokenId;
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    return (
        <div className="header">
            <div className="header__logo">
                <Apps />
                <h5>Microsoft Teams</h5>
            </div>
            <div className="header__search">
                <SearchIcon />
                <input type="text" placeholder="Search" />
            </div>
            <div className="header__options">
                <MoreHorizIcon />
                {user ? (
                    <div className="header__profile">
                        <Avatar src={user.data.photoUrl} alt={user.data.displayName}>{user.data.displayName.charAt(0)}</Avatar>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" className="header__login" color="primary">Sign In</Button>
                )}
            </div>
        </div>
    )
}

export default Header
