import { useContext } from 'react';
import { UserProvider, UserContext } from './contexts/User';
import { BrowserRouter } from "react-router-dom";

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
              <Main />
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
