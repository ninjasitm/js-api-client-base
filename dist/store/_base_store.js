"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("../logger"));
var Store = /** @class */ (function () {
    function Store(props) {
        this.init(props);
        // Instantiate the logger
        this.$log = this.$log || logger_1.default.create();
    }
    Store.prototype.init = function (props) {
        this.allTypes = {};
        this.setApp(props.app);
        this.setApi(props.api);
        this.setLogger(props.logger);
    };
    /**
     * Get the app object
     * @returns {Object}
     */
    Store.prototype.app = function () {
        return this.$app;
    };
    /**
     * Get the api object
     * @returns {Object}
     */
    Store.prototype.api = function () {
        return this.$api;
    };
    /**
     * Get the log object
     * @returns {Object}
     */
    Store.prototype.log = function () {
        return this.$log;
    };
    /**
     * Set the api
     * @param {Object} api
     */
    Store.prototype.setApi = function (api) {
        if (api instanceof Object) {
            try {
                api.setApp(this.$app);
                api.setApi(this.$app.$http);
            }
            catch (error) {
                this.log().warn("Missing setApp method", this.$api);
                api.$app = this.$app;
                var $app_1 = this.$app;
                api.app = function () {
                    return $app_1;
                };
                var $log_1 = this.$log;
                api.log = function () {
                    return $log_1;
                };
            }
            this.$api = api;
        }
    };
    /**
     * Set the app
     * @param {Object} app
     */
    Store.prototype.setApp = function (app) {
        if (app instanceof Object) {
            this.$app = app;
        }
    };
    /**
     * @param {Object} logger with the following signature {
     *  log: function,
     *  info: function
     *  warn: function,
     *  error: function
     *  trace: function,
     *  debug: function
     * }
     */
    Store.prototype.setLogger = function (logger) {
        this.$log = logger;
    };
    /**
     * Utility function to create the logger with the desired level
     * @param {string} level
     */
    Store.prototype.createLogger = function (level) {
        if (level === void 0) { level = 'INFO'; }
        this.$log = logger_1.default.create(level);
    };
    return Store;
}());
exports.default = Store;
