const configFactory = require('../config/webpack.config');
const webpack = require('webpack');

process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
	throw err;
});

const config = configFactory('production');
const compiler = webpack(config);

compiler.run((err, stats) => {
	if (err) {
    console.error(err);
    return;
  }

  console.log(stats.toString({
    chunks: false,  // 使构建过程更静默无输出
    colors: true    // 在控制台展示颜色
  }));
})