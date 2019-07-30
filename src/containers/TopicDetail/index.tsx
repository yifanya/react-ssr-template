import * as React from 'react';
import * as s from './index.m.less';
interface TopicDetailProps {
  routers?: Array<any>
}

interface TopicDetailState {

}

class Home extends React.Component<TopicDetailProps, TopicDetailState> {
  render () {
    return (
      <div>
        <h1 className={s['h']}>Topic-Detail~~~~</h1>
      </div>
    )
  }
}

export default Home;