import { composeStories } from '@storybook/react';
import { screen } from '@testing-library/react';
import * as stories from '../ToastProvider.stories';

const { Defaults } = composeStories(stories);

describe('Button', async () => {
  await Defaults.run();
  it('renders button', () => {
    const button = screen.getByText('test');
    expect(button).not.toBeNull();
  });
});
