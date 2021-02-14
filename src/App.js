import { useContext } from 'react';
import { UserProvider, UserContext } from './contexts/User';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Confirmation from './components/Confirmation';
import Login from './components/Login';
import Sample from './components/Sample';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

function App() {
  return (
        <BrowserRouter>
            <UserProvider>
                <Header />
                <Switch>
                    <Route path="/:userId/confirm" component={Confirmation} />
                    <Route component={Main} />
                </Switch>
                <Footer />
            </UserProvider>
        </BrowserRouter>
  );
}

function Main() {
    const [ user, ] = useContext(UserContext);

    if (user.name || user.email) {
        return <Sample/>;
    }

    return <Login/>;
}

export default App;
