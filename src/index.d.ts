interface Window {
  __INITIAL_STATE__  : object
  stores: object
}

interface IRouter {
  path: string,
  component: new() => React.Component<any, any>,
  routes?: Array<IRouter>,
  redirect?: string,
  exact?: boolean
}

declare module '@loadable/component';