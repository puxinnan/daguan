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
      <Route path="/" element={<Home />} />
      <Route path="/resource/:id" element={<ResourceDetail />} />
      <Route path="/dashboard" element={<StudyDashboard />} />
      <Route path="/dashboard/:subject" element={<StudyDashboard />} />
      <Route path="/lingoflow/*" element={<LingoFlowApp />} />
    </Routes>
  );
}

export default App;
