import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div style={{ position: 'absolute' }}>
      <a
        href='https://github.com/Noriller/refreshing-way-test'
        target='_blank'
        style={{ color: 'white', fontSize: '2em' }}>
        The repo for this project
      </a>
    </div>
    <App />
  </React.StrictMode>,
);
