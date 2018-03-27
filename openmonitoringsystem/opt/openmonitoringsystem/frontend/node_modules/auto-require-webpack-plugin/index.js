'use strict';

/**
 * AutoRequirePlugin
 * @param {boolean|string|function|RegExp|Array} options
 * @constructor
 */
function AutoRequirePlugin(options) {
    this.options = typeof options === 'undefined' ? false : options;
}

AutoRequirePlugin.prototype.apply = function (compiler) {
    var _this = this;

    compiler.plugin('compilation', function (compilation) {
        compilation.mainTemplate.plugin('render-with-entry', function (source, chunk) {
            try {
                var shouldRequireAutomatically = _this.shouldAutoRequire(compiler.options.output, chunk.name);
            } catch (err) {
                shouldRequireAutomatically = false;
            }

            if (shouldRequireAutomatically) {
                source.add("\n// When using require, call the module automatically\n");
                source.add("typeof define === 'function' && define.amd && require(['" + chunk.name + "']);\n");
            }

            return source;
        });
    });
};

/**
 * @param {Object} outputOptions
 * @param {string} moduleName
 * @return {boolean}
 */
AutoRequirePlugin.prototype.shouldAutoRequire = function (outputOptions, moduleName) {
    var autoRequire = outputOptions.autoRequire || this.options;

    if (autoRequire === null || autoRequire === undefined) {
        return false;
    }

    if (typeof autoRequire === 'boolean') {
        return autoRequire;
    }

    if (!/^(u|a)md$/.test(outputOptions.libraryTarget) || !outputOptions.umdNamedDefine) {
        return false;
    }

    var shouldRequireAutomatically = false;
    if (!(autoRequire instanceof Array)) {
        autoRequire = [autoRequire];
    }

    autoRequire.some(function (tester) {
        if (typeof tester === 'string') {
            return shouldRequireAutomatically = tester === moduleName;
        }

        if (tester instanceof RegExp) {
            return shouldRequireAutomatically = tester.test(moduleName);
        }

        if (tester instanceof Function) {
            return shouldRequireAutomatically = tester(moduleName);
        }

        return false;
    });

    return shouldRequireAutomatically;
};

module.exports = AutoRequirePlugin;
