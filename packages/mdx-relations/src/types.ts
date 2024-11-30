export type MetadataGenerator<
  F extends BaseFrontmatter = BaseFrontmatter,
  T = unknown,
> = (page: BasePage<F>) => T;

export type RelationGenerator<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F>,
  T = unknown,
> = (
  page: PageWithMetadata<F, M>,
  index: number,
  allPages: PageWithMetadata<F, M>[],
) => T;

export type MetadataGenerators<F extends BaseFrontmatter> = Record<
  string,
  MetadataGenerator<F>
>;

export type RelationGenerators<
  F extends BaseFrontmatter = BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
> = Record<string, RelationGenerator<F, M>>;

export type Config<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
> = {
  contentDirectory: string;
  metadataGenerators?: M;
  relationGenerators?: R;
  runGenerators?: boolean;
};

export type BaseFrontmatter = Record<string, unknown>;

export type File = {
  filePath: string;
  params: {
    slug: string[];
  };
};

export type BasePage<F extends BaseFrontmatter = BaseFrontmatter> = File & {
  content: string;
  frontmatter: F;
  updatedAt?: number;
};

export type InferMetadataTypes<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
> = {
  [K in keyof M]: M[K] extends MetadataGenerator<F> ? ReturnType<M[K]> : never;
};

export type InferRelationTypes<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F>,
  R extends RelationGenerators<F, M>,
> = {
  [K in keyof R]: ReturnType<R[K]>;
};

export type PageWithMetadata<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
> = BasePage<F> & {
  metadata: InferMetadataTypes<F, M>;
};

export type Page<
  F extends BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
> = PageWithMetadata<F, M>;

export type Filter<
  F extends BaseFrontmatter = BaseFrontmatter,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
  T extends Page<F, M, R> = Page<F, M, R>,
> = (page: T, index: number, array: T[]) => boolean;
