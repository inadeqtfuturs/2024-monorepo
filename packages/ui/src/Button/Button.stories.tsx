import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from './index';

const meta = {
	title: 'ui/button',
	component: Button,
	tags: ['autodocs'],
	args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: 'Button text',
	},
};
