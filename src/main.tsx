import React from "react";
import ReactDOM from 'react-dom/client';

import './styles/reset.css';
import './styles/theme.css';
import './styles/animation.css';

import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)