import React, { useState } from 'react';
import './GithubSearch.scss';
import SearchIcon from '@material-ui/icons/Search';

function GithubSearch({ setUser }) {
    const [input, setInput] = useState('');

    const handleClick = () => {
        setUser(input);
    }

    return (
        <div className="github__search">
            <input type="text" placeholder="GitHub username" className="search__field" onChange={(e) => setInput(e.target.value)} />
            <button className="search__button" onClick={handleClick}>
                <SearchIcon />
            </button>
        </div>
    )
}

export default GithubSearch
