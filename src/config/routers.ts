import loadable from "@loadable/component";
import RouterView from '../components/RouterView';

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
    asyncData(state: any) {
      state.AppState.changeName();
    }
  },
  {
    path: '/test',
    component: loadable(() => import('../containers/TestApi')),
    routes: [
      {
        path: '/son1',
        component: loadable(() => import('../containers/Son1')),
        asyncData(store: any) {
          store.AppState.changeAge(20);
        },
        routes: [
          {
            path: '/sonson2',
            component: loadable(() => import('../containers/Son2')),
            asyncData(store: any) {
              store.AppState.changeName('/test/son1/sonson2')
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