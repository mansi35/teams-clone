import React from 'react';
import './GithubSearch.scss';
import SearchIcon from '@material-ui/icons/Search';

function GithubSearch() {
    return (
        <div className="github__search">
            <input type="text" placeholder="GitHub username" className="search__field" />
            <button className="search__button">
                <SearchIcon />
            </button>
        </div>
    )
}

export default GithubSearch
