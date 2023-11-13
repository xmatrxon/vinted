import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { PrimeReactProvider } from 'primereact/api';
import Navbar from './components/Navbar';
import VintedFilterList from './components/VintedFilterList';
import { Route, Routes } from 'react-router-dom';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import Logout from './components/auth/Logout';
import ResetPassword from './components/ResetPassword';
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <>
      <PrimeReactProvider>
        <Navbar authUser={authUser} />
        <Routes>
          <Route path='/' element={<VintedFilterList />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/reset' element={<ResetPassword />} />
        </Routes>
      </PrimeReactProvider>
    </>
  );
}

export default App;
