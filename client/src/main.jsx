import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SafetyCenter from './pages/SafetyCenter';
import BeachDetails from './pages/BeachDetails';
import './styles.css';
import { LanguageContext } from './contexts/LanguageContext';

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/safety" element={<SafetyCenter/>}/>
          <Route path="/beaches/:id" element={<BeachDetails/>}/>
        </Routes>
        <footer className="footer">
          <div className="container footer-grid">
            <div>
              <h3>BeachSafe</h3>
              <p>Interactive Beach Tourism & Safety Information Portal</p>
            </div>
            <div>
              <span>React • Node • Express • MongoDB</span>
              <small>Tamil Nadu focused safety experience</small>
            </div>
          </div>
        </footer>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
