const baseConfigFactory = require('./webpack.config.js')

const NODE_ENV = process.env.NODE_ENV;

const config = baseConfigFactory(NODE_ENV);

module.exports = config;