/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';

import App from './App';
import { AppContextProvider } from './context/AppContext';

const Render = () =>
<AppContextProvider>
    <App />
</AppContextProvider>

render(() => Render(), document.getElementById('root') as HTMLElement);
