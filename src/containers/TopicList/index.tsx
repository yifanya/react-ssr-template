import * as React from 'react';
import * as s from './index.m.less';
import { connect } from 'react-redux';
import { ADDNUMBER, ASYNCADDNUMBER } from './actions';
import { TopicListStateProps } from './reducer';

interface TopicListProps {
  routers?: Array<any>
}

interface TopicListState {
  TopicListReducers: {
    count: number,
  }
}

interface TopicListDispatchProps {
  addCount: Function,
  asyncAddCount: Function
}

interface ComponentState {

}

@(connect<TopicListStateProps, TopicListDispatchProps>(
  (state: TopicListState) => {
    return {
      count: state.TopicListReducers.count
    }
  },
  (dispatch: any) => {
    return {
      addCount: () => dispatch({
        type: ADDNUMBER
      }),
      asyncAddCount: () => dispatch({
        type: ASYNCADDNUMBER
      })
    }
  }
) as any)

class Home extends React.Component<TopicListProps & TopicListStateProps & TopicListDispatchProps, ComponentState> {
  constructor (props: TopicListProps & TopicListStateProps & TopicListDispatchProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickAsync = this.handleClickAsync.bind(this);
  }

  handleClick () {
    this.props.addCount();
  }
  handleClickAsync () {
    let data = this.props.asyncAddCount();
    console.log(data)
  }

  render () {
    return (
      <div>
        <h1 className={s['h']}>Topic-List</h1>
        <h2>{ this.props.count }</h2>
        <button onClick={this.handleClick}> + </button>
        <button onClick={this.handleClickAsync}> async + </button>
      </div>
    )
  }
}
export default Home;