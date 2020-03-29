/* eslint-disable */
const postcssNormalize = require('postcss-normalize');

module.exports = {
	plugins: [
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
};
