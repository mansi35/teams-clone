import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { Link } from 'react-router-dom';

const CreateRoom = (props) => {
    const [id, setId] = useState('');
    function create() {
        setId(uuid());
    }

    return (
        <Link to={`/room/${id}`} target="_blank">
            <button onClick={create}>Create room</button>
        </Link>
    );
};

export default CreateRoom;
