import * as React from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

interface IProps {
  routers: Array<IRouter>,
  publicPath?: string 
}

function RouterView (props: IProps) {
  return (
    <Switch>
      {
        props.routers.map((item: IRouter, index: number) => {
          let Component = null;
          if (item.redirect) 
            Component = <Route path={item.path} key={index} exact={item.exact} render={() => <Redirect to={item.redirect as string}/>} />;
          
          else {
            Component = <Route path={item.path} key={index} exact={item.exact} render={
              props => {
                return <item.component {...props} routers={item.routes} />
              }
            }/>;
          }
          return Component;
        })
      }
    </Switch>
  )
}

RouterView.transRouters = function (routerConfig: Array<IRouter>) {
  function transformation (config: Array<IRouter>, publicPath: string = '') {
    for (let i = 0; i < config.length; i++) {
      config[i].path = publicPath + config[i].path;
      if (config[i].routes) {
        transformation(config[i].routes as Array<IRouter>, config[i].path)
      }
    }
  }

  transformation(routerConfig);
}

export default RouterView;