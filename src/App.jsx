import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResourceDetail from './pages/ResourceDetail';
import StudyDashboard from './pages/StudyDashboard';
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
