(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@dojo/test-extras/harness", "@dojo/widget-core/d", "../../../src/widgets/OpenMonitoringSystem", "../../../src/widgets/styles/OpenMonitoringSystem.m.css"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a = intern.getInterface('bdd'), describe = _a.describe, it = _a.it;
    var harness_1 = require("@dojo/test-extras/harness");
    var d_1 = require("@dojo/widget-core/d");
    var OpenMonitoringSystem_1 = require("../../../src/widgets/OpenMonitoringSystem");
    var css = require("../../../src/widgets/styles/OpenMonitoringSystem.m.css");
    describe('OpenMonitoringSystem', function () {
        it('should render widget', function () {
            var testHelloWorld = harness_1.default(OpenMonitoringSystem_1.default);
            testHelloWorld.expectRender(d_1.v('div', { classes: css.root }, [
                d_1.v('img', { src: './img/logo.svg', classes: css.logo }),
                d_1.v('div', { classes: css.label }, ['Hello, Dojo 2 World!'])
            ]));
        });
    });
});
//# sourceMappingURL=OpenMonitoringSystem.js.map