import { ASYNCADDNUMBER, ADDNUMBER } from './actions';
import { put, takeEvery, delay } from 'redux-saga/effects';

function * AsyncAdd (action: Action) {
  yield delay(1000);
  yield put({ type: ADDNUMBER });
}

export default function * () {
  yield takeEvery(ASYNCADDNUMBER, AsyncAdd)
}
