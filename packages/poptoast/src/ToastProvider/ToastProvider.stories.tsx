import type { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ToastProvider from './index';

const meta = {
  title: 'poptoast/provider',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaults: Story = {
  args: {
    children: 'test',
  },
};
