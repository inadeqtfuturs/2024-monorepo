import createUtils from '@if/mdx-relations';
import markdownLinkExtractor from 'markdown-link-extractor';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// blog
const { getPages: getBlogPages } = createUtils({
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

const { getPages } = createUtils({ contentDirectory: '../../content/pages' });
const { getPages: getWork } = createUtils({
  contentDirectory: '../../content/work',
});

export { getBlogPages, getPages, getWork };
