import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RouterView from '../../components/RouterView';



interface TestProps {
  routers?: Array<any>,
  location: Location
}

interface TestState {
  
}

class TestApi extends React.Component<TestProps, TestState> {
  constructor (props:TestProps) {
    super(props);
    this.handleMarkAll = this.handleMarkAll.bind(this);
    this.handleTopics = this.handleTopics.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleMarkAll () {
    axios.get('/api/message/mark_all', {
      params: {
        needAccessToken: true
      }
    }).then(res => console.log(res));
  }

  handleTopics () {
    axios.get('/api/topics')
      .then(res => console.log(res));
  }

  handleLogin () {
    axios.post('/api/user/login', {
      accessToken: "933374d1-2d26-473d-b3f2-ecaa6c05b77d"
    }).then(res => console.log(res));
  }

  render () {
    return (
      <>
        <button onClick={this.handleTopics}>topics</button>
        <button onClick={this.handleLogin}>login</button>
        <button onClick={this.handleMarkAll}>markall</button>
        <br/>
        <Link to="/test/son1">son1</Link>
        <Link to="/test/son2">son2</Link>
        <Link to="/test/son3">son3</Link>
        <RouterView routers={this.props.routers as Array<IRouter>}/>
      </>
    )
  }
}

export default TestApi;