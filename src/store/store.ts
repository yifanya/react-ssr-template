import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSagas from './sagas';


const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

export default function (initialState: object = {}) {
const sagaMiddleware = createSagaMiddleware();
  let store = null;
  if (initialState) {
    store = createStore(
      reducers,
      initialState,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    )
  }
  else {
    store =  createStore(
      reducers,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    )
  }
  const sagaTask = sagaMiddleware.run(rootSagas);
  return {
    store,
    sagaTask
  }
}