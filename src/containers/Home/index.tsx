import * as React from 'react';
import * as s from './index.m.less';
import Helmet from 'react-helmet';

interface HomeProps {
  routers?: Array<any>
}

interface HomeState {

}

class Home extends React.Component<HomeProps, HomeState> {
  render () {
    return (
      <div>
        <Helmet>
          <title>Home component</title>
          <meta name="description" content="description Home component" />
        </Helmet>
        <header className={s['header']}>
          jianshuaaaaa
        </header>
      </div>
    )
  }
}

export default Home;