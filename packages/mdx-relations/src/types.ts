export type MetadataGenerator<T = unknown> = (page: BasePage) => T;
export type RelationGenerator<T = unknown> = (
  page: PageWithMetadata,
  index: number,
  allPages: PageWithMetadata[],
) => T;

export type MetadataGenerators = Record<string, MetadataGenerator>;
export type RelationGenerators = Record<string, RelationGenerator>;

export type Config = {
  contentDirectory: string;
  metadataGenerators?: MetadataGenerators;
  relationGenerators?: RelationGenerators;
  runGenerators?: boolean;
};

export type BaseFrontmatter = Record<string, unknown>;

export type File = {
  filePath: string;
  params: {
    slug: string[];
  };
};

export type BasePage<T extends BaseFrontmatter = BaseFrontmatter> = File & {
  content: string;
  frontmatter: T;
  updatedAt?: number;
};

export type InferMetadataTypes<T extends MetadataGenerators> = {
  [K in keyof T]: T[K] extends MetadataGenerator ? ReturnType<T[K]> : never;
};

export type InferRelationTypes<T extends RelationGenerators> = {
  [K in keyof T]: T[K] extends RelationGenerator ? ReturnType<T[K]> : never;
};

export type PageWithMetadata<
  TGenerators extends MetadataGenerators = MetadataGenerators,
  TFrontmatter extends BaseFrontmatter = BaseFrontmatter,
> = BasePage<TFrontmatter> & {
  metadata: InferMetadataTypes<TGenerators>;
};

export type Page<
  TMetadataGenerators extends MetadataGenerators = MetadataGenerators,
  TRelationGenerators extends RelationGenerators = RelationGenerators,
  TFrontmatter extends BaseFrontmatter = BaseFrontmatter,
> = PageWithMetadata<TMetadataGenerators, TFrontmatter> & {
  metadata: InferMetadataTypes<TMetadataGenerators> &
    InferRelationTypes<TRelationGenerators>;
};

export type Filter<
  TMetadataGenerators extends MetadataGenerators = MetadataGenerators,
  TRelationGenerators extends RelationGenerators = RelationGenerators,
  TFrontmatter extends BaseFrontmatter = BaseFrontmatter,
  T extends Page<TMetadataGenerators, TRelationGenerators, TFrontmatter> = Page<
    TMetadataGenerators,
    TRelationGenerators,
    TFrontmatter
  >,
> = (page: T, index: number, array: T[]) => boolean;
