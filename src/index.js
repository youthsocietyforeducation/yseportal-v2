import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from 'src/redux/store';

import App from './App';
import './index.css';

if (process.env.NODE_ENV === 'development') {
  // allow dev env to read into redux.store
  window.store = store;
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
