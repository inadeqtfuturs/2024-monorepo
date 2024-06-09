import React from 'react';
import { composeStories } from '@storybook/react';
import { render } from '@testing-library/react';

import * as stories from '../Button.stories';

const { Defaults } = composeStories(stories);

describe('Button', () => {
	it('Component mounts', () => {
		render(<Defaults />);
	});
});
