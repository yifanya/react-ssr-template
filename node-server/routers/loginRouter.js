const router = require('express').Router();
const { Http } = require('../configs/http');

const { baseURL } = require('../configs/baseUrlConfig');

const { request } = new Http({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

router.post('/login', function (req, res, next) {
  console.log('req.body', req.body);
  request({
    url: '/accesstoken',
    method: 'POST',
    data: {
      accesstoken: req.body.accessToken
    }
  }).then (data => {
    req.session.user = {
      accessToken: req.body.accessToken,
      loginName: data.loginname,
      id: data.id,
      avatarUrl: data.avatar_url
    }
    res.json({
      success: true,
      data
    })
  }).catch (err => {
    if (err.response) {
      console.log(err.response.data);
      res.status(err.response.status).send({
        success: false,
        data: err.response.data
      })
    } else {
      next(err)
    }
  })
})

module.exports = router;