import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Main/Main';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ParticleComponent from './react-components/ParticleComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <React.StrictMode>
      <Routes>
        <Route exact path="/" element = {<><App/><ParticleComponent></ParticleComponent></>}/>
      </Routes>
    </React.StrictMode>
  </Router>
);
