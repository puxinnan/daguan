import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResourceDetail from './pages/ResourceDetail';
import StudyDashboard from './pages/StudyDashboard';
import LingoFlowApp from './pages/LingoFlowApp';
import './App.css';

const UnderConstruction = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'var(--text-primary)' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🚧 待开发中...</h1>
    <p style={{ color: 'var(--text-secondary)' }}>该模块正在火热施工中，敬请期待！</p>
    <a href="#/lingoflow" style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--accent-color)', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>去背单词</a>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<UnderConstruction />} />
      <Route path="/resource/:id" element={<UnderConstruction />} />
      <Route path="/dashboard" element={<UnderConstruction />} />
      <Route path="/dashboard/:subject" element={<UnderConstruction />} />
      <Route path="/lingoflow/*" element={<LingoFlowApp />} />
    </Routes>
  );
}

export default App;
