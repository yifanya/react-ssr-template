import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app';
import createStore from './store/store';
import routersConfig from './config/routers';
import RouterView from './components/RouterView';
import { Store } from 'redux';

export default (store: Store, routerContext:any, url:any ) => {
  const Container: any = () => {
    return (
      <Provider store={store}>
        <StaticRouter context={routerContext} location={url}>
          <App />
          <RouterView routers={routersConfig as Array<IRouter>} />
        </StaticRouter>
      </Provider>
    )
  }
  return <Container />
}

export {
  createStore,
  routersConfig
}