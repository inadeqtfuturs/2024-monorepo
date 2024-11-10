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
    mentions: ({ content }) => markdownLinkExtractor(content),
  },
  relationGenerators: {
    mentionedIn: (page, i, pages) => {
      const pageMentionedIn = pages.filter(({ metadata: { mentions } }) => {
        return mentions.includes(`/garden/${page.params.slug}`);
      });

      return pageMentionedIn;
    },
  },
});

export { getBlogPages };
