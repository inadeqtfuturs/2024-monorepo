import type { StorybookConfig } from '@storybook/nextjs';
import type { Preset, CompatibleString } from '@storybook/types';

import { join, dirname } from 'node:path';

type FrameworkName = CompatibleString<'@storybook/nextjs'>;
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
// @ts-ignore
function getAbsolutePath(value: string) {
	return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
	stories: ['../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		getAbsolutePath('@storybook/addon-onboarding') as Preset,
		getAbsolutePath('@storybook/addon-links') as Preset,
		getAbsolutePath('@storybook/addon-essentials') as Preset,
		getAbsolutePath('@chromatic-com/storybook') as Preset,
		getAbsolutePath('@storybook/addon-interactions') as Preset,
	],
	framework: {
		name: getAbsolutePath('@storybook/nextjs') as FrameworkName,
		options: {},
	},
};
export default config;
