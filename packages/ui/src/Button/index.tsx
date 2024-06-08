'use client';

import type { ReactNode } from 'react';

interface ButtonProps {
	children: ReactNode;
	className?: string;
}

function Button({ children, className }: ButtonProps) {
	return (
		<button
			type='button'
			className={className}
			onClick={() => alert('Hello world')}
		>
			{children}
		</button>
	);
}

export default Button;
