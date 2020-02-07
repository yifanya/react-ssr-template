import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './app';
import { createStore } from './store/store';
import RouterView from './components/RouterView';
import routersConfig from './config/routers';
import { loadableReady } from "@loadable/component";

const initialState = window.__INITIAL_STATE__  || {};
// const stores = createStore(initialState);
window.stores = window.stores || createStore(initialState)
const stores = window.stores;

function Component () {
  return (
    <Provider {...stores}>
      <BrowserRouter>
        <App />
        <RouterView routers={routersConfig as Array<IRouter>} />
      </BrowserRouter>
    </Provider>
  )
}

const Container = hot(Component);

loadableReady().then(() => {
  ReactDOM.hydrate(
    <Container />,
    document.getElementById('root')
  )
})