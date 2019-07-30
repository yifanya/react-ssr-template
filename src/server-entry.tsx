import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import App from './app';
import { createStore } from './store/store';
import routersConfig from './config/routers';
import RouterView from './components/RouterView';

useStaticRendering(true);
export default (stores:any, routerContext:any, url:any ) => {
  const Container: any = () => {
    return (
      <Provider {...stores}>
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