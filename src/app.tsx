import * as React from 'react';
import Home from './containers/Home';
import {
  Link
} from 'react-router-dom';

interface AppProps {

}

interface AppState {
  
}

class App extends React.Component<AppProps, AppState> {
  render () {
    return (
      <>
        <Home />
        <Link to="/">首页</Link>
        <Link to="/detail">详情页</Link>
        <Link to="/test">test page</Link>
      </>
    )
  }
}

export default App;