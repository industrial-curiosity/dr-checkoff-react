import { useContext } from 'react';
import { UserContext } from '../contexts/User';
import { deleteFromStorage } from "../storage/local";

function Header () {
    const [ user, setUser ] = useContext(UserContext);

    const logout = () => {
        deleteFromStorage('userSession');
        setUser({});
    };

    let signOutButton;
    if (user.name || user.email) {
        signOutButton = <button className="bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={logout}
        >
            Sign Out
        </button>
    }

    return (
        <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-center justify-between">
            <div className="flex items-center justify-between">
                <div>
                    <img className="w-16" src={window.location.origin + '/images/icons8-test-tube-100.png'} alt="logo" />
                </div>
                <div className="p-4">
                    Dr Checkoff
                </div>
            </div>
            <div>
                {signOutButton}
            </div>
        </div>
    );
};

export default Header;