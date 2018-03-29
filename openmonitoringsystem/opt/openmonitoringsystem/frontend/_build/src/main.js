(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@dojo/widget-core/mixins/Projector", "@dojo/widget-core/Registry", "@dojo/routing/RouterInjector", "./widgets/OpenMonitoringSystem"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Projector_1 = require("@dojo/widget-core/mixins/Projector");
    var Registry_1 = require("@dojo/widget-core/Registry");
    var RouterInjector_1 = require("@dojo/routing/RouterInjector");
    var OpenMonitoringSystem_1 = require("./widgets/OpenMonitoringSystem");
    var root = document.querySelector('my-app') || undefined;
    var routingConfig = [
        {
            path: '/',
            outlet: 'login',
            defaultRoute: true,
            children: [
                {
                    path: 'directory',
                    outlet: 'directory',
                    children: [
                        {
                            path: '{filter}',
                            outlet: 'filter'
                        }
                    ]
                },
                {
                    path: 'new-worker',
                    outlet: 'new-worker'
                }
            ]
        }
    ];
    var registry = new Registry_1.Registry();
    var router = RouterInjector_1.registerRouterInjector(routingConfig, registry);
    var Projector = Projector_1.ProjectorMixin(OpenMonitoringSystem_1.default);
    var projector = new Projector();
    projector.setProperties({ registry: registry });
    projector.append(root);
    router.start();
});
//# sourceMappingURL=main.js.map