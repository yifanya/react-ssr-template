const path = require("path");
const paths = require("./paths");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('../localLoader/getCSSModuleLocalIdent');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../localPlugins/WatchMissingNodeModulesPlugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

// style匹配
// css
const cssRegex = /\.css$/;
const cssModuleRegex = /\.m\.css$/;
// scss
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.m\.(scss|sass)$/;
// less
const lessRegex = /\.less$/;
const lessModuleRegex = /\.m\.less$/;
// stylus
const stylRegex = /\.styl$/;
const stylModuleRegex = /\.m\.styl$/;

module.exports = function (webpackEnv) {
	const isEnvProduction = webpackEnv === "production";
	const isEnvDevelopment = webpackEnv === "development";

	const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
			},
			"@teamsupercell/typings-for-css-modules-loader",
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
						require('autoprefixer'),
						postcssNormalize(),
						require('postcss-flexbugs-fixes'),
						require('postcss-preset-env')({
							autoprefixer: {
								flexbox: 'no-2009',
							},
							stage: 3,
						}),
					],
          sourceMap: isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvDevelopment,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

	return {
		mode: isEnvProduction ? "production" : "development",
		output: {
			filename: isEnvProduction ? "static/js/[name].[contenthash:8].js" : "static/js/bundle.js",
			path: paths.appBuild,
			chunkFilename: isEnvProduction ? "static/js/[name].[contenthash:8].chunk.js" : "static/js/[name].chunk.js",
		},
		entry: paths.appSrc,
		resolve: {
			extensions: [ '.tsx', '.ts', '.js' ]
		},
		plugins: [
			isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			isEnvProduction && new MiniCssExtractPlugin({
				filename: 'static/css/[name].[contenthash:8].css',
				chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
			}),
			new ManifestPlugin({
        fileName: 'asset-manifest.json',
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter(
            fileName => !fileName.endsWith('.map')
          );

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
			new ForkTsCheckerWebpackPlugin({
				eslint: true,
				checkSyntacticErrors: true
			}),
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          isEnvProduction
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
        )
      ),
		].filter(Boolean),
		module: {
			strictExportPresence: true,
			rules: [
				{ parser: { requireEnsure: false } },
				{
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('eslint-loader'),
              options: {
                cache: true,
                eslintPath: require.resolve('eslint'),
                resolvePluginsRelativeTo: __dirname,
              },
            },
          ],
          include: paths.appSrc
				},
				{
					oneOf: [
						{
							test: /\.(ts|tsx)$/,
							include: paths.appSrc,
							use: [
								"cache-loader",
								{
									loader: "thread-loader",
									options: {
										poolTimeout: Infinity,
										workers: require('os').cpus().length - 1
									}
								},
								{
									loader: "babel-loader",
									options: {
										cacheDirectory: true,
										cacheCompression: false
									}
								},
								{
									loader: "ts-loader",
									options: {
										transpileOnly: true,
										happyPackMode: true
									}
								}
							]
						},
						{
							test: cssRegex,
							exclude: cssModuleRegex,
							use: getStyleLoaders({
								importLoaders: 1,
								sourceMap: isEnvDevelopment,
							}),
							sideEffects: true,
						},
						{
							test: cssModuleRegex,
							use: getStyleLoaders({
								importLoaders: 1,
								sourceMap: isEnvDevelopment,
								modules: {
									getLocalIdent: getCSSModuleLocalIdent,
								},
							}),
						},
						{
							test: sassRegex,
							exclude: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: isEnvDevelopment,
								},
								'sass-loader'
							),
							sideEffects: true,
						},
						{
							test: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: isEnvDevelopment,
									modules: {
										getLocalIdent: getCSSModuleLocalIdent,
									},
								},
								'sass-loader'
							),
						},
						{
							test: lessRegex,
							exclude: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: isEnvDevelopment,
								},
								'less-loader'
							),
							sideEffects: true,
						},
						{
							test: lessModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 3,
									sourceMap: isEnvDevelopment,
									modules: {
										getLocalIdent: getCSSModuleLocalIdent,
									},
								},
								'less-loader'
							),
						}
					],
				}
			]
		},
		optimization: {
      minimize: isEnvProduction,
      minimizer: [
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
					extractComments: false
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
						parser: safePostCssParser,
						map: isEnvDevelopment
              ? {
                  inline: false,
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: true,
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
	}
}