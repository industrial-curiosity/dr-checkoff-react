import React, { useState, createContext } from 'react';
import { loadFromStorage } from "../storage/local";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [ user, setUser ] = useState(loadFromStorage('userSession') || {});

    return (
        <UserContext.Provider value={[ user, setUser ]}>
            {props.children}
        </UserContext.Provider>
    );
};
