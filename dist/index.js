"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStore = exports.BaseApi = void 0;
var services_1 = __importDefault(require("./services"));
var store_1 = __importDefault(require("./store"));
var services_2 = require("./services");
Object.defineProperty(exports, "BaseApi", { enumerable: true, get: function () { return __importDefault(services_2).default; } });
var store_2 = require("./store");
Object.defineProperty(exports, "BaseStore", { enumerable: true, get: function () { return __importDefault(store_2).default; } });
exports.default = {
    BaseApi: services_1.default,
    BaseStore: store_1.default
};
