import glob from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import fs from 'node:fs/promises';

import type {
  BasePage,
  Config,
  File,
  Filter,
  InferMetadataTypes,
  MetadataGenerators,
  Page,
  PageWithMetadata,
  RelationGenerators,
  BaseFrontmatter,
} from './types';

const getFiles = async (
  config: Config,
  pathToFiles?: string,
): Promise<File[]> => {
  const pathToContent = path.join(
    process.cwd(),
    pathToFiles || config.contentDirectory,
  );
  const pattern = `${pathToContent}/**/*.(md|mdx)`;

  try {
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**'],
    });

    return files.map((filePath) => {
      const relativePath = path.relative(pathToContent, filePath);
      const slug = relativePath
        .replace(new RegExp(`${path.extname(filePath)}$`), '')
        .split('/');
      return { filePath, params: { slug } };
    });
  } catch (error) {
    console.error('Error reading files:', error);
    return [];
  }
};

const generateMetadata = <T extends MetadataGenerators>(
  page: BasePage,
  metadataGenerators: T,
): InferMetadataTypes<T> => {
  return Object.entries(metadataGenerators).reduce(
    (acc, [key, generator]) => {
      (acc as any)[key] = generator(page);
      return acc;
    },
    {} as InferMetadataTypes<T>,
  );
};

const generatePage = async <T extends MetadataGenerators>(
  file: File,
  metadataGenerators?: T,
): Promise<PageWithMetadata<T>> => {
  try {
    const mdxSource = await fs.readFile(file.filePath, 'utf-8');
    const { content, data: frontmatter } = matter(mdxSource);

    const generatedMetadata = metadataGenerators
      ? generateMetadata({ ...file, content, frontmatter }, metadataGenerators)
      : ({} as InferMetadataTypes<T>);

    return {
      ...file,
      content,
      frontmatter,
      metadata: generatedMetadata,
    };
  } catch (error) {
    console.error(`Error generating page for ${file.filePath}:`, error);
    throw error;
  }
};

const getPaths = async (config: Config, contentPath?: string) => {
  const pathToFiles = contentPath || config.contentDirectory;
  const files = await getFiles(config, pathToFiles);

  const paths = files.map(({ params }) => ({ params }));
  return paths;
};

const generateRelations = <
  M extends MetadataGenerators,
  R extends RelationGenerators,
  F extends BaseFrontmatter,
>(
  pages: PageWithMetadata[],
  relationGenerators: R,
): Page<M, R, F>[] => {
  return Object.entries(relationGenerators).reduce(
    (acc, [key, generator]) => {
      const relations = pages.map((page, index) =>
        generator(page, index, pages),
      );

      return acc.map((page, index) => ({
        ...page,
        metadata: {
          ...page.metadata,
          [key]: relations[index],
        },
      }));
    },
    pages as Page<M, R, F>[],
  );
};

const filterPages = <
  M extends MetadataGenerators,
  R extends RelationGenerators,
  F extends BaseFrontmatter,
>(
  pages: Page<M, R, F>[],
  filter: Filter<M, R, F>,
): Page<M, R, F>[] => pages.filter(filter);

const getPages = async <
  M extends MetadataGenerators,
  R extends RelationGenerators,
  F extends BaseFrontmatter,
>(
  config: Config & { metadataGenerators?: M; relationGenerators?: R },
  filter?: Filter<M, R, F>,
): Promise<Page<M, R, F>[]> => {
  try {
    const files = await getFiles(config);

    const pages = await Promise.all(
      files.map((file) => generatePage(file, config.metadataGenerators)),
    );

    const pagesWithRelations = config.relationGenerators
      ? generateRelations<M, R, F>(pages, config.relationGenerators)
      : (pages as Page<M, R, F>[]);

    return filter
      ? filterPages<M, R, F>(pagesWithRelations, filter)
      : pagesWithRelations;
  } catch (error) {
    console.error('Error getting pages:', error);
    throw error;
  }
};

function createUtils<
  F extends BaseFrontmatter = BaseFrontmatter,
  M extends MetadataGenerators = MetadataGenerators,
  R extends RelationGenerators = RelationGenerators,
>(config: Config & { metadataGenerators?: M; relationGenerators?: R }) {
  return {
    getPaths: async (contentPath?: string) => getPaths(config, contentPath),
    getPages: ({ filter }: { filter?: Filter<M, R, F> } = {}) =>
      getPages<M, R, F>(config, filter),
  };
}

export default createUtils;
