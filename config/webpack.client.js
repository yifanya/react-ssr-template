const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
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
const LoadablePlugin = require('@loadable/webpack-plugin');

const proxyTable = require('./proxy-table');

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
    isDevelopment && require.resolve('style-loader'),
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve('typings-css-modules-loader'),
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
  bail: true,
  mode: NODE_ENV,
  devtool: isDevelopment ? "cheap-module-eval-source-map" : false,
  entry: {
    app: [
      paths.appIndexJs
    ]
  },
  output: {
    path: paths.appBuild('dist-client'),
    filename: '[name].[hash:4].js',
    publicPath: '/public/'
  },
  resolve: {
    extensions: [ '.web.ts', '.ts', '.web.tsx', '.tsx', '.web.js', '.js', '.json', '.web.jsx', '.jsx', '.less', '.css', '.m.less']
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: shouldUseSourceMap,
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: shouldUseSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 100000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 10
        },
        async: {
          chunks: 'async',
          priority: 0
        },
        default: {
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: true,
  },
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
          modules: {
            localIdentName: "[local]_[hash:base64:5]"
          }
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
            modules: {
              localIdentName: "[local]_[hash:base64:5]"
            }
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
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isProduction && new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
      checkSyntacticErrors: true
    }),
    new htmlWebpackPlugin(
      Object.assign(
      {},
      {
        inject: true,
        template: paths.resolveApp('public/index.html'),
      },
      isProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : undefined
    )),
    // new PurifyCssWebpack({
    //   paths:glob.sync(path.join(__dirname,'../client-dist/*.html'))
    // })
    new htmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../public/server.template.ejs'),
      filename: 'server.ejs'
    }),
    new LoadablePlugin()
  ].filter(Boolean)
}

if (isDevelopment) {
  webpackConfig.entry.app.unshift("react-hot-loader/patch");
  webpackConfig = webpackMerge(webpackConfig, {
    devServer: {
      hot: true,
      contentBase: path.join(__dirname, "./client-dist"),
      host: "0.0.0.0",
      port: 8080,
      publicPath: '/public',
      historyApiFallback: {
        index: '/public/index.html'
      },
      proxy: proxyTable,
    }
  })
}

module.exports = webpackConfig;