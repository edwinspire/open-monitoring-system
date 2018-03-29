(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@dojo/widget-core/mixins/Themed", "@dojo/widget-core/WidgetBase", "@dojo/widget-core/d", "./styles/login.m.css", "@dojo/routing/Link"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    // import { DNode } from '@dojo/widget-core/interfaces';
    var Themed_1 = require("@dojo/widget-core/mixins/Themed");
    var WidgetBase_1 = require("@dojo/widget-core/WidgetBase");
    var d_1 = require("@dojo/widget-core/d");
    var css = require("./styles/login.m.css");
    var Link_1 = require("@dojo/routing/Link");
    ;
    exports.ThemedBase = Themed_1.ThemedMixin(WidgetBase_1.WidgetBase);
    var login = /** @class */ (function (_super) {
        tslib_1.__extends(login, _super);
        function login() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        login.prototype.render = function () {
            return d_1.v('div', { classes: css.wrapper }, [
                d_1.v('div', { classes: css.container }, [
                    d_1.v('h1', {}, ['Open Monitoring System']),
                    d_1.v('form', { action: "#", method: "POST" }, [
                        d_1.v('input', { type: "hidden", name: "@command" }),
                        d_1.v('input', { type: "text", placeholder: "Username", name: "user" }),
                        d_1.v('input', { type: "password", placeholder: "Password", name: "pwd" }),
                        d_1.v('button', { type: "submit", id: "login-button",
                            onclick: function () {
                                console.log('Hello');
                            } }, ['Login Now']),
                        d_1.w(Link_1.Link, { key: 'home', to: 'home' }, ['Home'])
                    ]),
                    d_1.v('ul', { classes: css.bg_bubbles }, [
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li'),
                        d_1.v('li')
                    ]),
                ])
            ]);
        };
        login = tslib_1.__decorate([
            Themed_1.theme(css)
        ], login);
        return login;
    }(exports.ThemedBase));
    exports.login = login;
    exports.default = login;
});
//# sourceMappingURL=login.js.map