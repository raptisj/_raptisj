---
layout: "../../layouts/BlogPost.astro"
title: "Publish a React Component to NPM"
pubDate: "2020-08-18"
description: "The simplest Rollup boilerplate"
minutes: 4
---

In this article I'm going to walk you through the process of creating the simplest boilerplate environment there is, so you can publish your own React components to NPM. We will use [Rollup](https://rollupjs.org/guide/en/) to achieve this.

## What is Rollup(quickly)

Rollup is a module bundler for JavaScript which compiles your code into a single bundle. It can also do more complex and sophisticated things such as creating libraries or applications.

## Source

If you just want the basic Rollup boilerplate source.

- [basic-rollup-boilerplate](https://github.com/raptisj/basic-rollup-boilerplate)

If want to see an example check this repository where I build a highly useless custom Hook for adding and looping a set of emojis in the title of you app.

- [random-title-emoji](https://github.com/raptisj/random-title-emoji)

First we create a folder and init a `package.json` file.

```
mkdir awesome-rollup
cd awesome-rollup
npm init -y
```

Then we have to install a couple of dependencies.

- `@babel/code`: compiles new JavaScript syntax to older versions for browser compatibility

- `@babel/preset-env`: presets for configuring babel environment

- `@babel/preset-react`: tells babel-transpiler we are using react

- `react`

- `rollup`

- `rollup-plugin-babel`: In order to use babel wit Rollup

- `rollup-plugin-commonjs`: Converts CommonJS modules to ES2015 before Rollup can process them.

- `rollup-plugin-node-resolve`: finds external modules.

```
npm install @babel/core @babel/preset-env @babel/preset-react react rollup rollup-plugin-babel rollup-plugin-node-resolve rollup-plugin-commonjs --save-dev
```

After installing all of our dependencies we create a `rollup.config.js` in our root directory.

```javascript
import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import pkg from "./package.json"

export default {
  input: "package/index.js",
  output: {
    file: pkg.main,
    format: "cjs",
  },
  external: ["react"],
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
  ],
}
```

- **input**: Here we specify the path for our entry point. In our case is `package/index.js` where everything starts.
- **output**: It's an object that we specify the format of our output and the path we want our bundle to be placed. In our case we import the path from our `package.json` _main_ field which is specified as `dist/index.js`. Rollup will create a `dist` folder and place the bundle inside.
- **external**: It's an array that we can specify any external dependencies that we want to keep as external to the bundle. Here we set `react` as external.
- **plugins**: An array the we place all of our plugins. Notice that we use the `rollup-plugon-babel` to exclude `node_modules` thus avoiding compiling unwanted libraries.

Remember we are aiming for the simplest boilerplate there is. There are a lot of options you can add depending your packages size and complexity. Check the [Rollup official documentation](https://rollupjs.org/guide/en/#configuration-files) for the full list and how to configure them.

Then we have to set some Babel presets. Babel presets are configuration details placed in a `.babelrc` file where we are setting the environment we want our code to be transpiled to. We want React so our file looks like this.

```
{
   "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

In our `package` folder with the `index.js` as our export point we include all of our code.

```javascript
import React from "react"

const NPMComponent = () => {
  return <div>Hello, Rollup</div>
}

export { NPMComponent }
```

**Note**: Exporting in brackets without default, in our application the import will look something like this.

```javascript
import { NPMComponent } from "basic-rollup-boilerplate"
```

You do this if you have a collection of components that you what to use throughout an application.

But if you set the export as default . . .

```javascript
. . .
export default NPMComponent
```

import will look like this

```javascript
import NPMComponent from "basic-rollup-boilerplate"
```

If we choose this way we have to set our exports as `auto` in our output object.

```javascript
. . .
  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'auto'
  },
. . .
```

Lastly before testing our package in our `package.json` we set our build command that will compile and minify our code into a single bundle.

```
. . .
"scripts": {
    "build": "rollup -c"
 },
. . .
```

Now if we run `npm run build` in our terminal we get the bundle in our `dist` folder.
Pretty cool uh?

### Test and Publish

We can test our package locally before we publish it to NPM.
By running `npm link` you create a symlink in your global node_modules folder that links to your package. Then you head to another project and type `npm link -package name-`.

After checking that all is good we are ready to publish our package.

Make sure that your package name is available in [npmjs.com](http://npmjs.com).

Assuming you already have an account you can `npm login` to connect to `npmjs.com`.

Then run `npm publish` and you are of to the races.

If you want to make updates to you packages you can run `npm version -type-` where type could either be:

- **patch**: small patches (1.0.-_patch_-)
- **minor**: minor releases(1.-_minor_-.0)
- **major**: major releases(-_major_-.0.0)

**Note**: NPM won't let you publish again with the same version.

That was it.

I think this is a good starter setup to get the gist of it all.

Now off you go and make things.
