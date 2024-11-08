import { vi, describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import glob from 'fast-glob';
import createUtils from '../src/index';
import type {
  MetadataGenerator,
  RelationGenerator,
  Config,
} from '../src/types';

vi.mock('node:fs/promises');
vi.mock('fast-glob');

describe('Content Utils', () => {
  const mockCwd = '/app';
  const mockFiles = [
    `${mockCwd}/content/post-1.md`,
    `${mockCwd}/content/post-2.md`,
    `${mockCwd}/content/nested/post-3.md`,
  ];

  const mockFileContents = {
    [`${mockCwd}/content/post-1.md`]:
      '---\ntitle: Post 1\ndate: 2024-01-01\ntags: [one, two]\n---\nContent 1',
    [`${mockCwd}/content/post-2.md`]:
      '---\ntitle: Post 2\ndate: 2024-01-02\ntags: [two]\n---\nContent 2',
    [`${mockCwd}/content/nested/post-3.md`]:
      '---\ntitle: Post 3\ndate: 2024-01-03\ntags: [one, three]\n---\nContent 3',
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    (glob as unknown as jest.Mock).mockResolvedValue(mockFiles);

    (fs.readFile as unknown as jest.Mock).mockImplementation((path) =>
      Promise.resolve(mockFileContents[path]),
    );
  });

  describe('getPages', () => {
    it('should get all pages without any generators', async () => {
      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      const pages = await utils.getPages();

      expect(pages).toHaveLength(3);
      expect(pages[0].params.slug).toEqual(['post-1']);
      expect(pages[1].params.slug).toEqual(['post-2']);
      expect(pages[2].params.slug).toEqual(['nested', 'post-3']);
    });

    it('should apply metadata generators', async () => {
      const titleGenerator: MetadataGenerator = (page) =>
        page.frontmatter?.title as string;

      const config: Config = {
        contentDirectory: '/content',
        metadataGenerators: {
          title: titleGenerator,
        },
      };

      const utils = createUtils(config);
      const pages = await utils.getPages();

      expect(pages[0].metadata.title).toEqual('Post 1');
    });

    it('should apply relation generators', async () => {
      const nextPostGenerator: RelationGenerator = (_, index, allPages) => ({
        next: allPages[(index + 1) % allPages.length].params.slug,
      });

      const config: Config = {
        contentDirectory: '/content',
        relationGenerators: {
          navigation: nextPostGenerator,
        },
      };

      const utils = createUtils(config);
      const pages = await utils.getPages();

      expect(pages[0].metadata.navigation).toEqual({
        next: pages[1].params.slug,
      });
    });

    it('should apply filters correctly', async () => {
      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      const pages = await utils.getPages(
        (page) => !page.params.slug.includes('nested'),
      );

      expect(pages).toHaveLength(2);
      expect(pages.every((p) => !p.params.slug.includes('nested'))).toBe(true);
    });
  });

  describe('getPaths', () => {
    it('should return all page paths', async () => {
      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      const paths = await utils.getPaths();

      expect(paths).toEqual([
        { params: { slug: ['post-1'] } },
        { params: { slug: ['post-2'] } },
        { params: { slug: ['nested', 'post-3'] } },
      ]);
    });

    it('should handle custom content paths', async () => {
      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      const paths = await utils.getPaths('/custom');

      expect(glob).toHaveBeenCalledWith(
        expect.stringContaining('/custom'),
        expect.any(Object),
      );
    });
  });

  describe('error handling', () => {
    it('should handle file read errors gracefully', async () => {
      (fs.readFile as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('File read error'),
      );

      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      await expect(utils.getPages()).rejects.toThrow('File read error');
    });

    it('should handle glob errors gracefully', async () => {
      (glob as unknown as jest.Mock).mockRejectedValueOnce(
        new Error('Glob error'),
      );

      const config: Config = {
        contentDirectory: '/content',
      };

      const utils = createUtils(config);
      const pages = await utils.getPages();

      expect(pages).toEqual([]);
    });
  });

  describe('type safety', () => {
    it('should properly type metadata and relations', async () => {
      const titleGenerator = () => 'test';

      const nextGenerator = () => ['test'];

      const config = {
        contentDirectory: '/content',
        metadataGenerators: { title: titleGenerator },
        relationGenerators: { next: nextGenerator },
      };

      const utils = createUtils(config);
      const pages = await utils.getPages();

      const page = pages[0];
      expect(page.metadata.title).toBe('test');
      expect(page.metadata.next).toEqual(['test']);
    });
  });

  describe('filters', () => {
    it('should handle filters on frontmantter and metadata', async () => {
      const titleGenerator = () => 'test';
      const config = {
        contentDirectory: '/content',
        metadataGenerators: { title: titleGenerator },
      };

      const { getPages } = createUtils<{ tags: string[] }>(config);
      const pages = await getPages(({ frontmatter: { tags = [] } }) =>
        tags.includes('one'),
      );

      expect(pages.length).toEqual(2);
    });
  });
});
