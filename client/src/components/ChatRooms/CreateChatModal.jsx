import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select'
import { createConversation } from '../../actions/conversations';
import './ChatRooms.scss';

const CreateChatModal = (props) => {
    const dispatch = useDispatch();
    const [attendees, setAttendees] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [currentUser, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, []);

    const createChat = () => {
        if (attendees.length > 0) {
            dispatch(createConversation({
                Subject: groupName,
                UpdatedAt: new Date(),
                Attendees: [...attendees, { label: currentUser.result.name, value: currentUser.result._id }]
            }));
        }
        props.close();
    }

    const selectParticipants = (participants) => {
        setAttendees(participants);
        var i = 0, name = '';
        if (participants.length > 1) {
            for (i = 0; i < participants.length; i++) {
                name += participants[i].label + ', ';
            }
            name += 'and ' + currentUser.result.name;
        } else {
            name = participants[0] + ' and ' + currentUser.result.name;
        }
        setGroupName(name);
    }

    return (
        <div className="createChatModal">
            <div className="modal-wrapper"
                style={{
                    transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}>
                <div className="modal-header">
                    <h4>New Chat</h4>
                    <span className="close-modal-btn" onClick={props.close}>×</span>
                </div>
                <div className="modal-body">
                    <h6>Select Participants</h6>
                    <Select 
                        options={props.options}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e) => {selectParticipants(e)}}
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn-continue" onClick={() => {createChat()}}>CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

export default CreateChatModal
