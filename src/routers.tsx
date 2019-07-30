import * as React from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import TopicList from './containers/TopicList';
import TopicDetail from './containers/TopicDetail';
import TestApi from './containers/TestApi';

function getRoutes () {
  return (
    <Switch>
      <Route path="/" exact render={() => <Redirect to="/list" /> } />
      <Route path="/detail" component={TopicDetail} />
      <Route path="/list" component={TopicList} />
      <Route path="/test" component={TestApi} />
    </Switch>
  )
}

export default getRoutes