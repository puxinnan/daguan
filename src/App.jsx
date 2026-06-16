import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LingoFlowApp from './pages/LingoFlowApp';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<LingoFlowApp />} />
    </Routes>
  );
}

export default App;
