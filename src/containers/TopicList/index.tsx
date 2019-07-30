import * as React from 'react';
import * as s from './index.m.less';
import { observer, inject } from 'mobx-react';


interface TopicDetailProps {
  AppState: {
    report?: any,
    add: Function,
    count: number
  }
  routers?: Array<any>
}

interface TopicDetailState {

}

@inject('AppState')
@observer
class Home extends React.Component<TopicDetailProps, TopicDetailState> {
  constructor (props: TopicDetailProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    this.props.AppState.add();
  }

  render () {
    return (
      <div>
        <h1 className={s['h']}>Topic-List</h1>
        <h2>{ this.props.AppState.report }</h2>
        <button onClick={this.handleClick}> + </button>
      </div>
    )
  }
}

export default Home;