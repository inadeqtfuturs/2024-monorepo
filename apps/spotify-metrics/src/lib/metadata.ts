import type { Metadata } from 'next';

const defaultMetadata = (): Metadata => ({
  title: 'spotify metrics',
  description: 'get info about your spotify usage',
  robots: {
    index: true,
    follow: true,
  },
});

export default defaultMetadata;
