const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const PurifyCssWebpack = require('purifycss-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const isWsl = require('is-wsl');
const safePostCssParser = require('postcss-safe-parser');
const glob = require('glob');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNodeExternals = require('webpack-node-externals');

const NODE_ENV = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const shouldUseSourceMap = process.env.NODE_ENV === 'production' ? false : true;

const cssRegex = /\.css$/;
const cssModuleRegex = /\.m\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.m\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.m\.less$/;


const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve('typings-for-css-modules-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap,
      },
    });
  }
  return loaders;
};


let webpackConfig = {
  target: 'node',
  bail: true,
  mode: NODE_ENV,
  devtool: isDevelopment ? "cheap-module-eval-source-map" : false,
  entry: {
    app: [
      paths.resolveApp('src/server-entry.tsx')
    ]
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    path: paths.appBuild('dist-server'),
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2',
    publicPath: '/public/'
  },
  resolve: {
    extensions: [ '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx', '.less', '.css', '.m.less']
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 30000,
  //     maxSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     automaticNameMaxLength: 30,
  //     name: true,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: 10
  //       },
  //       async: {
  //         chunks: 'async',
  //         priority: 0          
  //       },
  //       default: {
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   },
  //   runtimeChunk: true,
  // },
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isProduction && shouldUseSourceMap,
        }),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        // sideEffects: true,
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: isProduction && shouldUseSourceMap,
          modules: true,
          localIdentName: "[local]_[hash:base64:5]"
        })
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: isProduction && shouldUseSourceMap,
          },
          'less-loader'
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        // sideEffects: true,
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: isProduction && shouldUseSourceMap,
            modules: true,
            localIdentName: "[local]_[hash:base64:5]"
          },
          'less-loader'
        ),
      },
      {
        test: /\.(bmp|gif|jpe?g|png)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        use: [  
          {
            loader: 'babel-loader'
          }, 
          {
            loader: require.resolve('ts-loader'),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          }
        ]
      },
      {
        test: /\.(js|jsx|mjs)$/,
        include: paths.appSrc,
        use: [
          {
            loader:'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    // isDevelopment && new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    })
  ].filter(Boolean)
}

module.exports = webpackConfig;