# mdx-relations

i have markdown. i want to generate relations between them.

`mdx-relations` is a light set of utilities for compiling markdown and generating relational data between markdown files. `mdx-relations` abstracts a lot of the boilerplate you might otherwise need to write to power a `md|x` backed site and provides granular control over how your files are processed.

**Please Note**: This software is in early beta and the api is still prone to change. Please check readme between versions.

## toc

1. [getting started](#getting-started)
2. [api](#api)
3. [typescript](#typescript)
4. [future](#future)

## getting started

1. install using your preferred package manager. the example below uses `npm`

``` shell
npm install mdx-relations
```

2. create an `mdx-relations.config.js` file in your project

``` javascript
import { createUtils } from 'mdx-relations'

export const {
    getPaths,
    getPages,
    getPageProps,
    getPathsByProp
} = createUtils({
    contentDirectory: '/content'
})
```

3. use any of the exported function to source your data

## api

`mdx-relations` takes a config object and returns utilities for generating static content and relationships between them. Most of the api for actually generating the pages is what you would write yourself if you were spinning up a blog or statically generated site. What `mdx-relations` provides is a suite of utilities that process your data, overrides to filesystem-based routing, and allows you to intervene at critical points in the content generation process.

Behind the scenes, we do the following:

1. get all of the files from your content folder
2. for each file, we generate metadata based on config provided functions, and return everything you'd want to know about that file (frontmatter, filepath, params/slug, etc)
3. because we have access to all the files and metadata, we then allow for inserting custom relations between content. for example, we can track when one file mentions another from the file being mentioned
4. we sort the files based on provided sort criteria. we sort last in case you want to sort based on generated meta or relational data

At the end of this process, you have all your files sorted, and you can filter down to what you need based on the meta and relational data that have been generated.

Additionally, all of the above is opt in. If you don't need to generate extra metadata or relational data, this package still provides easily consumable markdown.

### config



