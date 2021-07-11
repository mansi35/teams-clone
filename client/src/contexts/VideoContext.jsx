import { useState, useRef, createContext, useContext } from 'react';

const UserContext = createContext();
const ClientContext = createContext();


export const useUsers = () => {
    return useContext(UserContext);
}


export const useClient = () => {
    return useContext(ClientContext);
}


export const VideoProvider = ({ children }) => {

    const [users, setUsers] = useState([]);
    const rtc = useRef({
        screenClient: null,
        client: null,
        localAudioTrack: null,
        localVideoTrack: null,
        localScreenTrack: null,
    });


    return (
        <ClientContext.Provider value = {rtc}>
            <UserContext.Provider value={[users, setUsers]}>
                {children}
            </UserContext.Provider>
        </ClientContext.Provider>
    )
}
