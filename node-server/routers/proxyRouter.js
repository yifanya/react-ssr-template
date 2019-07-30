const { Http } = require('../configs/http');
const { baseURL } = require('../configs/baseUrlConfig');

const { request } = new Http({
  baseURL
});

module.exports = function (req, res, next) {
  const { path } = req;
  const user = req.session.user || {};
  const needAccessToken = req.query.needAccessToken;
  console.log(path);

  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query);
  if (needAccessToken) delete req.query.needAccessToken;
  
  request({
    url: path,
    method: req.method,
    params: query,
    data: Object.assign({}, req.body, {
      accesstoken: user.accessToken
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(data => {
    res.json({
      success: true,
      data
    })
  }).catch(err => {
    if (err.response) 
      res.status(500).json({
        success: false,
        data
      })
    else 
      res.status(500).send({
        success: false,
        data: err,
        msg: '未知错误'
      })
  })
}