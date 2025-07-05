import React from 'react';
import DashboardLayout from '@/layouts/Dashboard';
import DashboardProvider from '@/context/DashboardContext';
import { cookies } from 'next/headers';
import { accessTokenKey, refreshTokenKey } from '@/lib/constants';

// middleware handles login page redirect
async function Page() {
  const appCookies = await cookies();
  const accessToken = appCookies.get(accessTokenKey);
  // const refreshToken = appCookies.get(refreshTokenKey);
  return (
    <DashboardProvider cookies={{ accessToken }}>
      <DashboardLayout />
    </DashboardProvider>
  );
}

export default Page;
