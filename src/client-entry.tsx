import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import RouterView from './components/RouterView';
import routersConfig from './config/routers';
import { loadableReady } from "@loadable/component";
import { Provider } from 'react-redux';
import createStore from './store/store';
import { Store } from 'redux';
import { Task } from 'redux-saga';

const initialState = window.__INITIAL_STATE__  || {};
// const stores = createStore(initialState);
const { store, sagaTask }: { store: Store, sagaTask: Task }= createStore(initialState);
window.stores = window.stores || store;
(window as any).sagaTask = sagaTask;
const stores = window.stores as Store;
sagaTask.toPromise().then(data => console.log('saga end promise', data))

function Component () {
  return (
    <Provider store={stores}>
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