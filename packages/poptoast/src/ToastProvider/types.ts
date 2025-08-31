import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'custom';

export type ToastOptions = {
  id?: string;
  duration?: number;
  type?: ToastType;
};

export type Toast = {
  id: string;
  type: ToastType;
  message: string | ReactNode; // children?
  createdAt: number;
  duration: number;
};
