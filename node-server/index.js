const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('static-favicon');
// 业务代码
const session = require('express-session');
const bodyParser = require('body-parser');
const queryString = require('query-string');

const isDev = process.env.NODE_ENV === 'development';
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'session-id',
  resave: false,
  secret: 'asdasdhalisdaiusda'
}))

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use('/api/user', require('./routers/loginRouter'));
app.use('/api/', require('./routers/proxyRouter'));

if (!isDev) {
  console.log('production')
  require('./pro-serve')(app)
}
else {
  console.log('development')
  require('./dev-serve')(app)
}

app.use((err, req, res, next) => {
  res.status(500).send(err)
})

app.listen(3000, () => {
  console.log('server start')
});