import type { StorybookConfig } from '@storybook/nextjs';
import flexbugFixes from 'postcss-flexbugs-fixes';
import presetEnv from 'postcss-preset-env';
import { dirname, join } from 'node:path';

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
                options: {
                  implementation: require.resolve('postcss'),
                  postcssOptions: {
                    plugins: [
                      flexbugFixes(),
                      presetEnv({
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 2,
                      }),
                    ],
                  },
                },
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
};
export default config;
