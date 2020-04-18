"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Keys;
(function (Keys) {
    Keys[Keys["Down"] = 40] = "Down";
    Keys[Keys["End"] = 35] = "End";
    Keys[Keys["Enter"] = 13] = "Enter";
    Keys[Keys["Escape"] = 27] = "Escape";
    Keys[Keys["Home"] = 36] = "Home";
    Keys[Keys["Left"] = 37] = "Left";
    Keys[Keys["PageDown"] = 34] = "PageDown";
    Keys[Keys["PageUp"] = 33] = "PageUp";
    Keys[Keys["Right"] = 39] = "Right";
    Keys[Keys["Space"] = 32] = "Space";
    Keys[Keys["Tab"] = 9] = "Tab";
    Keys[Keys["Up"] = 38] = "Up";
})(Keys = exports.Keys || (exports.Keys = {}));
function formatAriaProperties(aria) {
    var formattedAria = Object.keys(aria).reduce(function (a, key) {
        a["aria-" + key.toLowerCase()] = aria[key];
        return a;
    }, {});
    return formattedAria;
}
exports.formatAriaProperties = formatAriaProperties;

/*# sourceMappingURL=util.js.map*/