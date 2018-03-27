# auto-require-webpack-plugin

Webpack plugin to automatically require the module itself, if module name defined. For Example:

```js
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("common/view", [], factory);
	else if(typeof exports === 'object')
		exports["common/view"] = factory();
	else
		root["common/view"] = factory();
})(this, function() {
  /* Module code here */
});

// When using require, call the module automatically
typeof define === 'function' && define.amd && require(['common/view']);
```

## Usage

### new AutoRequirePlugin(options)

```js
/* Use constructor options directly */
var options = true;

module.exports = {
  plugins: [
    new AutoRequirePlugin(options)
  ]
};
```

Or

```js
/* Use `output.autoRequire` to set options */
var options = true;

module.exports = {
  output: {
    autoRequire: options
  },
  plugins: [
    new AutoRequirePlugin()
  ]
};
```

There are two ways to configure AutoRequirePlugin: constructor's parameter or `output.autoRequire`. **The latter will override constructor's parameter.**

## Examples

Type of `options` can be `boolean`, `string`, `RegExp`, `function` and `Array`.

### Require all modules

```js
module.exports = {
  plugins: [
    new AutoRequirePlugin(true)
  ]
};
```

### Require module with specific name

```js
module.exports = {
  plugins: [
    new AutoRequirePlugin('common/view')
  ]
};
```

### Require module(s) matching regular expression

```js
module.exports = {
  plugins: [
    new AutoRequirePlugin(/^common/)
  ]
};
```

### Require module(s) testing by function

```js
module.exports = {
  plugins: [
    new AutoRequirePlugin(function (moduleName) {
      return moduleName.split('/').length > 2;
    })
  ]
};
```

### More complex case

```js
module.exports = {
  plugins: [
    new AutoRequirePlugin([
      /^pages\/.+/,
      function (moduleName) {
        return moduleName.indexOf('common') >= 0 && moduleName.indexOf('widgets') < 0;
      }
    ])
  ]
};
```
