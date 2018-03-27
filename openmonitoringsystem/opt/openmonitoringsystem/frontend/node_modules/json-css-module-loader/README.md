# Json Css Module Loader

[![Build Status](https://travis-ci.org/tomdye/json-css-module-loader.svg?branch=master)](https://travis-ci.org/tomdye/json-css-module-loader)
[![npm version](https://badge.fury.io/js/json-css-module-loader.svg)](https://badge.fury.io/js/json-css-module-loader)

Webpack loader to load css-module json output and the corresponding css file.
ie. loading `myApp.css.json` will provide the requiring module with the css-module
classnames and create a require for `myApp.css` so that the `css` is included.

## Installation

`npm install --save json-css-module-loader`

## Usage

### Webpack 1 config

You may need to add `.css.json` (or similar) to your webpack resolve extensions.

``` javascript
module: {
	loaders: [
		{ test: /\.css\.json$/, loader: 'json-css-module-loader' }
	]
}
```

## License

This loader is adapted from the [`json-loader`](https://github.com/webpack/json-loader);

MIT (http://www.opensource.org/licenses/mit-license.php)
