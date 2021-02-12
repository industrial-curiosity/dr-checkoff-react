import { useContext, useState } from 'react';
import { UserContext } from '../contexts/User';
import { useLocation } from "react-router-dom";
import { loadFromStorage, saveToStorage } from "../storage/local";
import api from '../api';
import ms from 'ms';

const VALID_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let loadedRememberMe = loadFromStorage('rememberMe') || { remember: false, email: null };

// deviceId required to enable multiple sessions and
// future session management
let deviceId = loadFromStorage('deviceId');
if (!deviceId) {
    deviceId = `web browser`;
    saveToStorage('deviceId', deviceId);
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Login () {
    const [ , setUser ] = useContext(UserContext);
    const [ email, setEmail ] = useState(loadedRememberMe.email || '');
    const [ password, setPassword ] = useState('');
    const [ rememberMe, setRememberMe ] = useState(loadedRememberMe.remember);

    let query = useQuery();
    const __DEV__ = query.get("dev") === "true";

    const loginPostRequest = async (values) => {
        if (__DEV__) {
            return {
                "name": "Jim",
                "authToken": "KLDJS89D7F8DSFIUSD9FJSDCSD9C8UYS",
                "authTokenExpiration": "30m",
                "refreshToken": "VKOCVIOPXIV90V890CX8V90XC786CXVCX",
                "refreshTokenExpiration": "30d",
                "deviceId": "web browser"
            };
        }
        return await (await fetch(`${api.baseUrl}/login`, api.formatPostRequest(values))).json();
    };

    const login = async () => {
        try {
            // trim email for mobile phones
            let values = {
                email,
                password,
                deviceId
            };
            let authenticationTimestamp = new Date().getTime();
            console.log(`logging in to ${api.baseUrl} from ${deviceId}`);
            let json = await loginPostRequest(values);
            if (json.error) {
                alert(json.error);
            } else {
                console.log('login successful');
                // convert authTokenExpiration and refreshTokenExpiration to local timestamps
                json.authTokenExpiration = authenticationTimestamp + ms(json.authTokenExpiration);
                json.refreshTokenExpiration = authenticationTimestamp + ms(json.refreshTokenExpiration);

                await saveToStorage("userSession", json);

                if (rememberMe) {
                    loadedRememberMe = {
                        email: values.email,
                        remember: true
                    };
                } else {
                    loadedRememberMe = {
                        remember: false,
                        email: null
                    };
                    setEmail('');
                }
                saveToStorage('rememberMe', loadedRememberMe);
                setUser(json);
            }
        } catch (e) {
            console.log(e);
            alert("A network error occurred.");
        }
    }

    let emailEntered = email.length > 0;
    let emailValidationWarning;
    if (email.length > 0 && !(VALID_EMAIL.test(email))) {
        emailValidationWarning = <p className="text-red-500 text-xs italic">Please enter a valid email address.</p>
    };

    let passwordEntered = password.length > 0;
    let passwordValidationWarning;
    if (passwordEntered && password.length < 8) {
        passwordValidationWarning = <p className="text-red-500 text-xs italic">Password must be at least 8 characters in length.</p>
    }

    const rememberMeHandler = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="mb-4">
                <label className="block text-grey-800 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800"
                    id="email"
                    type="text"
                    placeholder="Email address"
                    onChange={e => { setEmail(e.target.value); }}
                    value={email}
                ></input>
                {emailValidationWarning}
            </div>
            <div className="mb-6">
                <label className="block text-grey-800 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-800 mb-3"
                    id="password"
                    type="password"
                    placeholder="******************"
                    onChange={e => { setPassword(e.target.value); }}
                ></input>
                {passwordValidationWarning}
            </div>
            <div className="flex items-center">
                <button className="p-4 bg-blue-400 hover:bg-blue-800 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
                    type="button"
                    onClick={login}
                    disabled={!emailEntered || !passwordEntered || emailValidationWarning || passwordValidationWarning}
                >
                    Sign In
                </button>
                &nbsp;
                <div className="p-4 bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                    <label className="flex items-baseline">
                        <input className="form-checkbox"
                            type="checkbox"
                            defaultChecked={loadedRememberMe.remember}
                            onChange={rememberMeHandler}
                        />
                        <span className="ml-2">Remember Me</span>
                    </label>
                </div>
                &nbsp;
                <div className="p-4 bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
                    <a className="inline-block align-baseline text-sm" href="https://example.com">
                        Forgot Password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;