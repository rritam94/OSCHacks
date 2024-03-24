import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatboxComponent from './react-components/ChatboxComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatboxComponent />
  </React.StrictMode>
);

