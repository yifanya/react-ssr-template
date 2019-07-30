import AppStateClass from './app.state';


export const AppState = AppStateClass;

export default {
  AppState
}

export const createStore = (initialState: any = {}) => {
  return {
    AppState: new AppStateClass(initialState.AppState || {})
  }
}