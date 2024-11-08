import createUtils from '@if/mdx-relations';

const { getPages } = createUtils({
  contentDirectory: '../../content/garden/',
});

export { getPages };
