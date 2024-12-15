import type { Metadata } from 'next';

type DefaultMetadata = {
  title: string;
  description: string;
  ogImage: string;
};

const defaultMetadata = (
  {
    title = 'home',
    description = 'alex - making stuff online',
    ogImage = 'profile.jpg',
  }: Partial<DefaultMetadata> = {
    title: 'home',
    description: 'alex - making stuff online',
    ogImage: 'profile.jpg',
  },
): Metadata => ({
  title: `alex christie  | ${title}`,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: `/${ogImage}`,
        width: 700,
        height: 700,
        alt: 'if',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
});

export default defaultMetadata;
