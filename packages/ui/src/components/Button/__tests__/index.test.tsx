import { composeStories } from '@storybook/react';
import { screen } from '@testing-library/react';
import * as stories from '../Button.stories';

const { Defaults } = composeStories(stories);

describe('Button', async () => {
  await Defaults.run();
  const button = screen.getByText('test');
  console.log('@--> button', button);
  expect(button).not.toBeNull();
});
