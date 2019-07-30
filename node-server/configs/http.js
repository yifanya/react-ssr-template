const axios = require('axios');

class Http {
  constructor(config) {
    this.config = Object.assign({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    }, config);
    this.request = this.request.bind(this);
  }

  interceptors (instance) {
    instance.interceptors.request.use(function (config) {
      // console.log('config', config);
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    instance.interceptors.response.use(function (response) {
      return response.data;
    }, function (error) {
      return Promise.reject(error);
    });
  }

  request (config) {
    const instance = axios.create(Object.assign({}, this.config));
    this.interceptors(instance);
    return instance(config);
  }
}

exports.Http = Http;