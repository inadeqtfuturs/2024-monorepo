'use client';
import React from 'react';
import type { ReactNode } from 'react';
import classname from '../../utils/classname';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function Button({ children, className, onClick = () => {} }: ButtonProps) {
  return (
    <button
      type='button'
      className={classname([className, styles.button])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
