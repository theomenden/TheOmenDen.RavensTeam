import { StrictMode } from 'react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(<App />)
