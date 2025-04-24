import { React, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'

import Navbar from './components/Navbar.jsx';

import { useAuthStore } from './store/useAuthStore.js';

import { Loader } from 'lucide-react';

import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  if (isCheckingAuth && !authUser) {
    // Draw loading anim when checkingAuth & not authenticated
    return(<div className="flex items-center justify-center h-screen">
      <Loader className="size-16 animate-spin"/>
    </div>);
  }

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ?<SignupPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </>
  )
}

export default App;