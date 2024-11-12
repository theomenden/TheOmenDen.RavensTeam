import { createRoot } from 'react-dom/client';
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import './index.css';
import { App } from './App';

const root = createRoot(document.getElementById('root')!)

root.render(
    <FluentProvider theme={teamsDarkTheme}>
        <App />
    </FluentProvider>
);
