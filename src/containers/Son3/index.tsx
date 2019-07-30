import * as React from 'react';
interface TopicDetailProps {
  routers?: Array<any>
}

interface TopicDetailState {

}

class SonComponent extends React.Component<TopicDetailProps, TopicDetailState> {
  render () {
    return <h1>SonComponent 3</h1>
  }
}

export default SonComponent;