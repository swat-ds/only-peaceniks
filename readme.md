# Only Peaceniks

Demo for the Alma/Primo API as well as revisiting webpack dev workflow. Overkill for this project, but how else are you going to keep up to date?

- Basic `npm` + `webpack` dependency chain
- Basic `webpack` watch set up
    - `node-sass`
    - `webpack-dev-server`
    - `html-webpack-plugin`
- Make basic Primosearch call
- Parse data
- Augment data with cover image of video (using OMDB)
- Sort table by expiration date  (had to parse hand inputted date field)
- Using `DataTables` -- though is there a better way?

### Notes

While I'm still on the fence about whether my tiny projects benefit from Webpack, I'll use this as an opportunity  to work through what I learned. As ever, when I step away from JS development for a minute, it always takes waaay longer than I expect to get back in. The issue is: What's a minimal toolchain that meets our small projects? Hard to resist following the trends for larger JS webapps.

The idea of using a bundling tool to create flexible builds (conceptually a lot like workflow for compiling binary than old-school webdev, at least to me) is certainly ascendant. Two most popular tools are webpack and browserify, though webpack continues to be more heavily used. Yes, I know they're different, but still ...

I found out a few years ago that I was unnecessarily including gulp/grunt into my workflow -- for simple sass compilation and js uglification, no need to look further than `npm` scripts defined in `package.json`.

However, I'm pretty interested in ES6 features, which regular old uglify does not support. Plus more flexible browser compatibility ala babel seems like a good idea. That plus built in templating, handling requires, etc., makes webpack interesting to pick up if not strictly necessary. As a side note, as I'm interested in JS static site development, most of which is webpack based (e.g., gatsby), seems useful to at least be familiar.

What are the questions webpack answers?

- How to manage complex javascript dependency trees and deploy them flexibly?
  - chunking
  - cache busting
  - configurable per dependency options (external loading, etc.)
  - templating
- How to run a local server with live reload that doesn't (or sucks less) than alternatives?
- How to structure a flexibly preprocessing chain (e.g., uglify, sass, compression, image processing)?

What doesn't it answer?

- Does web development really need to become more like conventional software development and doesn't it take the fun out of it?

Basically: define a launch script in `package.json` to launch webpack as configured by `webpack.config.js` and you're good.

webpack plugins that seem pretty useful so far:

- `webpack-dev-server` launches a local server and serves static files from distribution as well as dynamically rendered files as defined in the webpack config (note that this is for dev and does not actually do a complete build)
- `HtmlWebpackPlugin` allows you to define your own HTML template, which seems essential -- unless a fancy React app, unclear why you'd want to futz with shitty JS templating
- `CleanWebpackPlugin` taken on faith that this is good for deleting stale assets on rebuild

~~Found that  `      // filename: path.resolve(__dirname, './dist/index.html')` in HTMLWebpackPlugin silently fucks with the ability of the Webpack Dev Server to compile new files rather than serve from memory -- must be enabled/disabled based on mode production or dev.~~ (I didn't quite understand what the dev server was doing vs. running a build)

#### Configuration

After futzing with a number of Medium/Stackexchange/other posts, I found Colt to be most useful for webpack v4 -- both the [example repo](https://github.com/Colt/webpack-demo-app) and [his YouTube playlist](https://www.youtube.com/watch?v=3On5Z0gjf4U&list=PLblA84xge2_zwxh3XJqy6UVxS60YdusY8).

- create a `src` folder in the project root for all project scripts and assets,makes things a little easier to keep track of down the line.
- `npm init` & `npm install --save-dev` example barebones module list below
- create appropriate `npm run` scripts, e.g.:
```
    "build": "npx webpack --config webpack.prod.js",
    "start": "npx webpack-dev-server --config webpack.dev.js --open"
```
- create separate webpack `dev` and `prod` config files -- note that you really do need different files to save hassle -- creating a shared `common` file that is then imported into `prod` and `dev` configs is another helpful pattern, but seemed a little extra
- `dev` config doesn't need much -- this is what's served when running the dev server. Note that this does not invoke all of the parameters/rules/plugins you might have set up for production even if they were included in the file, which is why it seems like a good idea to keep these options separate to avoid confusion. Webpack dev server generates files in memory on the fly for development purposes (obv) -- it does not run through the full build, does not generate new files, etc.
- `prod` config can get complicated (webpack is complicated), this is where the full complement of rules, optimizations, and preprocessing happens -- again, only on build. Caused me unending grief and despair that I didn't clue into how **a)** webpack defaults are very different for different modes and **b)** some production parameters will mess up how webpack dev server serves -- a tiny distinction that wasn't made clear in the umpteen tutorials I consulted.

#### Basic Concepts

The webpack model relies on annoyingly specific lexicon (IMO) and I thought I could gloss over it, which only resulted in a gnashing of teeth. I wish I head spent two second first trying to understand the underlying model, at least superficially.

- **entry** Worth noting the obvious that webpack is for Javascript -- everything else is secondary. Similar to but not exactly the `main.js` or whatever you might be used to. Here you designate the entrypoint js file(s) that trigger the rest of the pipeline. However, unlike the js you might be used to, everything needs to be included via ECMAScript `import` statements -- even non-js assets (really, all css, images, data, need to be imported).
- **output** While the entry parameter is more a metafile and includes much more than the regular old js you might call in a `script` tag, the output parameter is actually just the executable javascript that you intend to include in your page/app.
- **path** Not that complicated but still worth noting that it's pretty dynamic if you think of all the templating and preprocessing going on, for example, resolving differently for webpack dev server than for build.  `path` module resolve method (i.e., `path.resolve(__dirname, 'dist/js')`) is your friend.
- **rules** If you want webpack to handle files other than js files and you want to handle them differently from js files you need to write rules specifying how to identify and handle those files (i.e., regex to parse extensions).
- **loaders** Modules specific to different filetypes that handle those filetypes differently. How to parse, preprocess, and minify scss? How to copy over image or font files without doing anything to them? What if you want to change all the html refs and filenames for those assets to include a content hash in order to override caching?
- **plugins** Imported modules invoked to do stuff somewhere along the pipeline.
- **optimization** Modules invoked to do something at the end of the pipeline in production.

#### Barebones module list for basic web development

**webpack**

- "webpack"
- "webpack-cli"
- "webpack-dev-server" 
- "clean-webpack-plugin"

**loaders**

- "css-loader"
- "file-loader"
- "html-loader"
- "sass-loader"
- "style-loader"

**optimization/preprocessing**

- "node-sass"
- "mini-css-extract-plugin"
  - allows you to work with css like a normal human rather than have all styles rendered inline and/or declared in js like a weirdo
- "optimize-css-assets-webpack-plugin"
- "terser-webpack-plugin"
  - uglify replacement
- "html-webpack-plugin"
  - rather than have webpack automagically create an html template for all your js, set your own template -- webpack will still handle injecting js, style, href paths, and other templating as needed