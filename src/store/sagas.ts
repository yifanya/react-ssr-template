import { all, fork } from 'redux-saga/effects';
import TopicListSagas from '../containers/TopicList/saga';

export default function * rootSagas () {
  yield all([
    fork(TopicListSagas)
  ])
}