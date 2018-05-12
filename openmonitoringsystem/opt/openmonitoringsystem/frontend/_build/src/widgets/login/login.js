(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@dojo/widget-core/mixins/Themed", "@dojo/widget-core/WidgetBase", "@dojo/widget-core/d", "./styles/login.m.css", "@dojo/core/request"], factory);
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
    var request_1 = require("@dojo/core/request");
    var Login = /** @class */ (function (_super) {
        tslib_1.__extends(Login, _super);
        function Login() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Login.prototype.Submit = function (evt) {
            evt.preventDefault();
            console.log(evt);
            alert('Ha hecho click');
            var myValues = { namess: '00000000000000000000000000000009', ddhd: 10 };
            request_1.default.post('services/', { method: 'POST', user: 'edwin', password: 'hhhhhh', body: JSON.stringify(myValues) }).then(function (response) {
                //response.json();
                console.log(response);
            });
            return false;
        };
        Login.prototype.render = function () {
            return d_1.v('div', { classes: css.login_body }, [
                d_1.v('div', { classes: css.wrapper }, [
                    d_1.v('div', { classes: css.container }, [
                        d_1.v('h1', {}, ['Open Monitoring System']),
                        d_1.v('form', { onsubmit: this.Submit }, [
                            d_1.v('input', { type: "hidden", name: "@command" }),
                            d_1.v('input', { type: "text", placeholder: "Username", name: "user" }),
                            d_1.v('input', { type: "password", placeholder: "Password", name: "pwd" }),
                            d_1.v('button', { type: "submit", id: "login-button" }, ['Login Now'])
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
                ])
            ]);
        };
        Login = tslib_1.__decorate([
            Themed_1.theme(css)
        ], Login);
        return Login;
    }(WidgetBase_1.WidgetBase));
    exports.default = Login;
});
//# sourceMappingURL=login.js.map