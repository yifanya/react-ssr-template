import * as React from 'react';
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
      componentName: 'Son2'
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.setState({
      componentName: 'SonComponent2'
    })
  }

  render () {
    return (
      <>
        <h1>SonComponent 2</h1>
        <button onClick={this.handleClick} >changeName</button>
        <p>{this.state.componentName}</p>
      </>
    )
  }
  componentDidMount () {
    console.log('son2 componentDidMount')
  }
  componentWillReceiveProps () {
    console.log('son2 componentWillReceiveProps')
  }
  shouldComponentUpdate (nextProps: TopicDetailProps, nextState: TopicDetailState) {
    console.log('son2 shouldComponentUpdate')
    return true;
  }
  componentWillUpdate () {
    console.log('son2 componentWillUpdate')
  }
  componentDidUpdate () {
    console.log('son2 componentDidUpdate')
  }
  componentWillUnmount () {
    console.log('son2 componentWillUnmount')
  }
}

export default SonComponent;