const flexbugsFixes = require('postcss-flexbugs-fixes');
const presetEnv = require('postcss-preset-env');

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		flexbugsFixes(),
		presetEnv({
			autoprefixer: {
				flexbox: 'no-2009',
			},
			stage: 2,
		}),
	],
};

module.exports = config;
