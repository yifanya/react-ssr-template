import loadable from "@loadable/component";
import RouterView from '../components/RouterView';
import * as TopicListAction from '../containers/TopicList/actions';
import { Store } from 'redux';

const routers = [
  {
    path: '/',
    redirect: '/list',
    exact: true
  },
  {
    path: '/detail',
    component: loadable(() => import('../containers/TopicDetail'))
  },
  {
    path: '/list',
    component: loadable(() => import('../containers/TopicList')),
    asyncData(store: Store) {
      store.dispatch({
        type: TopicListAction.ADDNUMBER
      })
    }
  },
  {
    path: '/test',
    component: loadable(() => import('../containers/TestApi')),
    routes: [
      {
        path: '/son1',
        component: loadable(() => import('../containers/Son1')),
        asyncData(store: Store) {
          store.dispatch({
            type: TopicListAction.ASYNCADDNUMBER
          })
        },
        routes: [
          {
            path: '/sonson2',
            component: loadable(() => import('../containers/Son2')),
            asyncData(store: Store) {
              console.log('store', store);
            }
          },
          {
            path: '/sonson3',
            component: loadable(() => import('../containers/Son3'))
          },
        ]
      },
      {
        path: '/son2',
        component: loadable(() => import('../containers/Son2'))
      },
      {
        path: '/son3',
        component: loadable(() => import('../containers/Son3'))
      },
    ]
  },
]

RouterView.transRouters(routers as Array<IRouter>);

export default routers;