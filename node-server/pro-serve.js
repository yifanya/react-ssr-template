const fs = require('fs');
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const { ChunkExtractor, ChunkExtractorManager } = require("@loadable/server");
const ReactSSR = require('react-dom/server');
const { matchRoutes } = require('react-router-config');
const React = require('react');
const { Helmet } = require("react-helmet");
const { END } = require('redux-saga');

const getFile = p => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, p), 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data)
  })
});
const getFileSync = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
const getSEOElement = () => {
  let head = Helmet.renderStatic();
  return {
    title: head.title.toString(),
    meta: head.meta.toString(),
    link: head.meta.toString()
  }
}

const throwError = (obj, cause) => {
  if (obj instanceof Error) {
    console.log(cause)
    throw obj;
  }
}

module.exports = function (app) {
  let routesAsyncData = Object.create(null);
  // 生产环境打包的服务器端代码
  const serverEntryCode = require('../dist-server/server-entry').default;
  // 获取server template 
  const template = getFileSync('../dist-client/server.ejs');
  // 获取 loadableStats.json 文件
  const statsJson = getFileSync('../dist-client/loadable-stats.json');
  const extractor = new ChunkExtractor({
    stats: statsJson,
    entrypoints: ["app"]
  });
  // 获取服务端打包文件导出的对象
  const { default: serverBundle, createStore, routersConfig } = require('../dist-server/server-entry');

  // 获取初始化的state
  const getInitialState = (store) => {
    return store.getState();
  }

  app.use('/public', express.static(path.join(__dirname, '../dist-client')));
  app.get('*', async (req, res) => {
    const routerContext = {};
    const store = createStore();
    const app = serverBundle(store, routerContext, req.url);

    const content = ReactSSR.renderToString(
      React.createElement(
        ChunkExtractorManager,
        { extractor },
        app
      )
    );
    if (routerContext.url) {
      res.status(302).setHeader('Location', routerContext.url);
      res.end();
      return
    }

    // 先进行数据的预处理
    routesAsyncData = matchRoutes(routersConfig, req.url).map( ({ route, match }) => {
      const asyncData = route.asyncData;
      return asyncData && asyncData(store, Object.assign(match.params, req.query))
    }).filter(Boolean);
    const asyncDatas =  await Promise.all(routesAsyncData);
    throwError(asyncDatas, 'asyncDatas Errors')

    store.dispatch(END);
    const sagasResult = await sagaTask.toPromise();
    throwError(sagasResult, 'Sagas Task Errors')

    // 然后将所有store的数据转换成对象
    const initialState = getInitialState(store);
    console.log('get initial state end', initialState);

    const SEO = getSEOElement();

    const html = ejs.render(template, {
      appString: content,
      initialState: JSON.stringify(initialState),
      ...SEO
    })
    res.send(html);
  })
}