const axios = require('axios');
const webpack = require('webpack');
const path = require('path');
const memoryFS = require('memory-fs');
const serverConfig = require('../config/webpack.server');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const React = require('react');
const proxy = require('http-proxy-middleware');
const ejs = require('ejs');
const { ChunkExtractor, ChunkExtractorManager } = require("@loadable/server");
const { matchRoutes } = require('react-router-config');
const { Helmet } = require("react-helmet");
const NativeModule = require('module');
const vm = require('vm');
const { END } = require('redux-saga');

const mfs = new memoryFS();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
// const Module = module.constructor;
let routesAsyncData = Object.create(null);
let extractor = Object.create(null);
let serverBundle = Object.create(null);
let createStore = Object.create(null);
let routersConfig = Object.create(null);

const getLoadableStats = () => new Promise((resolve, reject) => {
  axios.get('http://localhost:8080/public/loadable-stats.json')
    .then(res => {
      resolve(res.data)
    })
    .catch(err => {
      console.log('getLoadableStats error');
      reject(err);
    })
})

const getTemplate = () => new Promise((resolve, reject) => {
  axios.get('http://localhost:8080/public/server.ejs')
    .then(res => {
      resolve(res.data)
    })
    .catch(err => {
      console.log('err')
      reject(err)
    })
})

const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper,{
    filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m
}

serverCompiler.watch({}, (err, stats) => {
  if (err) {
    console.log('webpack server bundle error');
    throw err
  }
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename,
  );
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');

  const m = getModuleFromString(bundle, 'srver-entry.js')
  // const m = new Module();
  // m._compile(bundle, 'server-entry.js');
  serverBundle = m.exports.default;
  createStore = m.exports.createStore;
  routersConfig = m.exports.routersConfig;
  console.log('bundle end~~~~~~~')
})

const getInitialState = (store) => {
  return store.getState();
}

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
  app.use('/public', proxy({
    target: 'http://localhost:8080'
  }))

  app.get('*', async (req, res) => {
    const statsJson = await getLoadableStats();
    extractor = new ChunkExtractor({
      stats: statsJson,
      entrypoints: ["app"]
    });
    const template = await getTemplate();

    const routerContext = {};
    const { store, sagaTask } = createStore();
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

    routesAsyncData = matchRoutes(routersConfig, req.url).map( ({ route, match }) => {
      const asyncData = route.asyncData;
      return asyncData && asyncData(store, Object.assign(match.params, req.query))
    }).filter(Boolean);

    const asyncDatas =  await Promise.all(routesAsyncData);
    throwError(asyncDatas, 'asyncDatas Errors')

    store.dispatch(END);
    const sagasResult = await sagaTask.toPromise();
    throwError(sagasResult, 'Sagas Task Errors')
    console.log('sagas task end')
    // 终止sagas
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