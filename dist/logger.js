"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_logger_1 = __importDefault(require("js-logger"));
var logger = {
    create: function (level) {
        if (level === void 0) { level = "INFO"; }
        js_logger_1.default.useDefaults();
        js_logger_1.default.setLevel({
            name: level
        });
        return js_logger_1.default;
    }
};
exports.default = logger;
