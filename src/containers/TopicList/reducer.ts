import { ADDNUMBER } from './actions';

export interface ITopicList {
  count: number
}

const initialState = {
  count: 0
}

export default (state: ITopicList = initialState, actions: Action) => {
  switch (actions.type) {
    case ADDNUMBER: 
      return Object.assign({}, {
        count: state.count + 1
      })
    default: 
      return state;
  }
}

export interface TopicListStateProps {
  count?: number
}