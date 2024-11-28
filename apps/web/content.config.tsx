import createUtils from '@if/mdx-relations';
import markdownLinkExtractor from 'markdown-link-extractor';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

type FrontMatter = {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
};

// blog
const { getPages: getBlogPages } = createUtils<FrontMatter>({
  contentDirectory: '../../content/garden/',
  metadataGenerators: {
    date: ({ frontmatter: { date } }) => {
      return dateFormatter.format(new Date(date as string));
    },
    mentions: ({ content }) => markdownLinkExtractor(content) as string[],
  },
  relationGenerators: {
    mentionedIn: (page, _i, pages) => {
      const pageMentionedIn = pages.filter(({ metadata: { mentions } }) => {
        return mentions.includes(`/garden/${page.params.slug}`);
      });
      return pageMentionedIn;
    },
  },
});

const { getPages, getPage } = createUtils({
  contentDirectory: '../../content/pages',
});
const { getPages: getWork } = createUtils({
  contentDirectory: '../../content/work',
});

export type Page = Awaited<ReturnType<typeof getBlogPages>>[number];

export { getBlogPages, getPage, getPages, getWork };
