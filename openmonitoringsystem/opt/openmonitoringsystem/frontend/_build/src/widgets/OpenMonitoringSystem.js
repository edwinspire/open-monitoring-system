(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@dojo/widget-core/WidgetBase", "@dojo/widget-core/d", "@dojo/widget-core/mixins/Themed", "./../widgets/login/Outlet", "./styles/OpenMonitoringSystem.m.css"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WidgetBase_1 = require("@dojo/widget-core/WidgetBase");
    var d_1 = require("@dojo/widget-core/d");
    var Themed_1 = require("@dojo/widget-core/mixins/Themed");
    //import { Link } from '@dojo/routing/Link';
    var Outlet_1 = require("./../widgets/login/Outlet");
    /*
    import { WorkerFormData } from './WorkerForm';
    import { WorkerProperties } from './Worker';
    import WorkerFormOutlet from './../outlets/WorkerFormOutlet';
    import WorkerContainerOutlet from './../outlets/WorkerContainerOutlet';
    import BannerOutlet from './../outlets/BannerOutlet';
    import FilteredWorkerContainerOutlet from './../outlets/FilteredWorkerContainerOutlet';
    
    import workerData from './../support/workerData';
    */
    var css = require("./styles/OpenMonitoringSystem.m.css");
    var App = /** @class */ (function (_super) {
        tslib_1.__extends(App, _super);
        function App() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /*	private _newWorker: Partial<WorkerFormData> = {};
        
            private _workerData: WorkerProperties[] = workerData;
        
            private _addWorker() {
                this._workerData = this._workerData.concat(this._newWorker);
                this._newWorker = {};
                this.invalidate();
            }
        
            private _onFormInput(data: Partial<WorkerFormData>) {
                this._newWorker = {
                    ...this._newWorker,
                    ...data
                };
                this.invalidate();
            }
        */
        App.prototype.render = function () {
            return d_1.v('div', [
                d_1.w(Outlet_1.default, {})
            ]);
        };
        App = tslib_1.__decorate([
            Themed_1.theme(css)
        ], App);
        return App;
    }(Themed_1.ThemedMixin(WidgetBase_1.WidgetBase)));
    exports.default = App;
});
//# sourceMappingURL=OpenMonitoringSystem.js.map