import path from 'node:path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
	stories: ['../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@chromatic-com/storybook',
		{
			name: '@storybook/addon-styling-webpack',
			options: {
				rules: [
					{
						test: /\.css$/,
						use: [
							'style-loader',
							{
								loader: 'css-loader',
								options: { importLoaders: 1 },
							},
							{
								loader: 'postcss-loader',
								options: { implementation: require.resolve('postcss') },
							},
						],
					},
				],
			},
		},
	],
	framework: {
		name: '@storybook/nextjs',
		options: {
			nextConfigPath: '../../web/next.config.js',
		},
	},
	webpackFinal: async (config) => {
		if (config.module) {
			config.module.rules = config.module.rules?.map((rule) => {
				if (
					rule &&
					typeof rule !== 'string' &&
					rule.test instanceof RegExp &&
					rule.test.test('test.css')
				) {
					return { ...rule, sideEffects: true };
				}
				return rule;
			});
		}
		return config;
	},
};
export default config;
