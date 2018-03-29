(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@dojo/routing/Outlet", "./login"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Outlet_1 = require("@dojo/routing/Outlet");
    var login_1 = require("./login");
    exports.LoginOutlet = Outlet_1.Outlet({ index: login_1.default }, 'login');
    exports.default = exports.LoginOutlet;
});
//# sourceMappingURL=Outlet.js.map