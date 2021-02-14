import { useState } from 'react';
import { useLocation } from "react-router-dom";
import api from '../api';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Confirmation (props) {
    const [ isConfirming, setIsConfirming ] = useState(false);
    const [ success, setSuccess ] = useState(false);
    const [ response, setResponse ] = useState(null);

    let query = useQuery();

    const __DEV__ = query.get("dev") === "true";

    const confirmPostRequest = async (values) => {
        if (__DEV__) {
            return {
                "success": true,
                "message": "Account confirmation succeeded."
            };
        }
        return await (await fetch(`${api.baseUrl}/register/confirm`, api.formatPostRequest(values))).json();
    };

    const confirm = async() => {
        let values = {
            userId: props.match.params.userId,
            otp: query.get("token")
        };
        console.log(`confirming account with ${api.baseUrl}`);
        let json = await confirmPostRequest(values);
        if (json.reason) {
            setResponse(json.reason);
        } else {
            setResponse(json.message);
            setSuccess(true);
        }
    }

    if (!isConfirming && !response) {
        setIsConfirming(true);
        confirm();
    }

    let message, loginLink;
    if (!response) {
        message = <p className="hover:ring-2 hover:bg-red-500">
            Confirming account registration...
        </p>
    } else {
        message = <p className="hover:ring-2 hover:bg-red-500">
            {response}
        </p>
    }
    if (success) {
        loginLink = <a className="App-link hover:ring-2 hover:bg-red-500"
            href={`${window.location.origin}/`}
            rel="noopener noreferrer"
        >
        Login to your new account here
        </a>
    }

    return (
        <div className="App">
            <header className="App-header">
                {message}
                {loginLink}
            </header>
        </div>
    );
};

export default Confirmation;