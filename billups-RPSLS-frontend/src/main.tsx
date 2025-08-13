import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import ComputerPage from './pages/ComputerPage';
import OpponentPage from './pages/OpponentPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/game" element={<GamePage />} />
        <Route path="/computer" element={<ComputerPage />} />
        <Route path="/opponent" element={<OpponentPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);