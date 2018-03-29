(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@dojo/test-extras/harness", "./../../login"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a = intern.getInterface('bdd'), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach, afterEach = _a.afterEach;
    var harness_1 = require("@dojo/test-extras/harness");
    var login_1 = require("./../../login");
    var widget;
    describe('login', function () {
        beforeEach(function () {
            widget = harness_1.default(login_1.default);
        });
        afterEach(function () {
            widget.destroy();
        });
        it('should construct login', function () {
            widget.expectRender(null);
        });
    });
});
//# sourceMappingURL=login.js.map