interface Window {
  __INITIAL_STATE__  : object
  stores: object,
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any,
}

interface IRouter {
  path: string,
  component: new() => React.Component<any, any>,
  routes?: Array<IRouter>,
  redirect?: string,
  exact?: boolean
}

interface Action {
  type: string,
  data?: any 
}

declare module '@loadable/component';