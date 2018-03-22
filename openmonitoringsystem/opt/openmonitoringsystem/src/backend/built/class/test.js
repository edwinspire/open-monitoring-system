"use strict";
exports.__esModule = true;
var ZipCodeValidator = /** @class */ (function () {
    function ZipCodeValidator() {
    }
    ZipCodeValidator.prototype.isAcceptable = function (s) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    };
    ZipCodeValidator.numberRegexp = /^[0-9]+$/;
    return ZipCodeValidator;
}());
exports["default"] = ZipCodeValidator;
