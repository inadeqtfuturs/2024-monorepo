import React from 'react';
import type { ReactNode } from 'react';
import classname from '../utils/classname';
import styles from './Button.module.css';

interface ButtonProps {
	children: ReactNode;
	className?: string;
}

function Button({ children, className }: ButtonProps) {
	return (
		<button
			type='button'
			className={classname([className, styles.button])}
			onClick={() => alert('Hello world')}
		>
			{children}
		</button>
	);
}

export default Button;
