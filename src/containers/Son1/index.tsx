import * as React from 'react';
import RouterView from '../../components/RouterView'
import { Helmet } from 'react-helmet';

interface TopicDetailProps {
  routers?: Array<any>
}

interface TopicDetailState {
  componentName: string
}

class SonComponent extends React.Component<TopicDetailProps, TopicDetailState> {
  constructor (props: TopicDetailProps) {
    super(props);
    this.state = {
      componentName: 'Son1'
    }
    this.handleClick = this.handleClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    // console.log('static getDerivedStateFromProps');
    // console.log('nextProps', nextProps);
    // console.log('prevState', prevState);
    // 挂载 或者 更新 调用
    return null;
  }

  handleClick () {
    this.setState({
      componentName: 'SonComponent1'
    })
  }

  render () {
    return (
      <>
        <Helmet>
          <title>SonComponent </title>
          <meta name="description" content="description SonComponent component" />
        </Helmet>
        <h1>SonComponent 1</h1>
        <p>{ this.state.componentName }</p>
        <button onClick={this.handleClick}>changeName</button>
        <RouterView routers={this.props.routers as Array<IRouter>} />
      </>
    )
  }

  shouldComponentUpdate(nextProps: TopicDetailProps, nextState: TopicDetailState) {
    // console.log('shouldComponentUpdate');
    return true
  }

  getSnapshotBeforeUpdate(prevProps: TopicDetailProps, prevState: TopicDetailState) {
    // console.log('getSnapshotBeforeUpdate');
    return {a:'a'}
  }
  componentDidUpdate (prevProps: TopicDetailProps, prevState: TopicDetailState, params: any) {
    // console.log('params', params);
    // console.log('componentDidUpdate');
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount')
  }
}

export default SonComponent;