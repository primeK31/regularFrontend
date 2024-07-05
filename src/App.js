import logo from './logo.svg';
import {useEffect, useState} from 'react';
import {jwtDecode as jwt_decode}from 'jwt-decode';
import Heads from './components/header'
import Foots from './components/footer';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Start from './Start';

import Loading from './components/loading';
import './loading.css';

const CLIENT_ID = "979867492503-ammrj7c12beo51f4k80nnfbmho85akkr.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive";

function App() {
  return (
    <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/start' element={<Start />} />
  </Routes>
  );
}

export default App;