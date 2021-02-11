import { useContext } from 'react';
import { UserContext } from '../contexts/User';
import { deleteFromStorage, loadFromStorage } from "../storage/local";
import logo from '../logo.svg';
import ms from 'ms';

let pageInitialLoadTime = Date.now();

function Sample () {
    const [ user, setUser ] = useContext(UserContext);

    const logoutIfNotRememberMe = () => {
        if (!loadFromStorage('rememberMe').remember) {
            console.log('page refreshed with remember me not flagged, signing out');
            deleteFromStorage('userSession');
            setUser({});
        }
    };
    if (user.authTokenExpiration - pageInitialLoadTime <= 0) logoutIfNotRememberMe();

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo hover:ring-2 hover:ring-red-500" alt="logo" />
                <p className="hover:ring-2 hover:bg-red-500">
                    Welcome, {user.name}, to Dr Checkoff!
                </p>
                <p className="hover:ring-2 hover:bg-red-500">
                    Authentication token expires in {ms(user.authTokenExpiration - Date.now())}
                </p>
                <a className="App-link hover:ring-2 hover:bg-red-500"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                Learn React
                </a>
            </header>
        </div>
    );
};

export default Sample;