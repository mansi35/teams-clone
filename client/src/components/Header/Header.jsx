import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Avatar } from '@material-ui/core';
import {ReactComponent as Apps} from '../../assets/apps.svg'
import './Header.scss'

function Header() {
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
                <Avatar src="" />
            </div>
        </div>
    )
}

export default Header
