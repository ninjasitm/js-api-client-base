"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("../logger"));
var axios_1 = __importDefault(require("axios"));
var utils_1 = __importDefault(require("./utils"));
function initDefaultApi(options) {
    if (options === void 0) { options = {}; }
    var api = axios_1.default.create(__assign({
        timeout: 1000
    }, options));
    return api;
}
/**
 * This class provides some core functionality that other modules can extend from
 *
 * @class BaseApi
 */
var BaseApi = /** @class */ (function () {
    /**
     *Creates an instance of BaseApi.
     * @param {Object} props
     * {
     *  type: string,
     *  path: string,
     *  basePath: string,
     *  logger: {
     *      log: function,
     *      info: function
     *      warn: function,
     *      error: function
     *      trace: function,
     *      debug: function
     *  },
     *  api: {}
     * }
     * @memberof BaseApi
     */
    function BaseApi(props) {
        if (props === void 0) { props = {}; }
        this.$app = {};
        this.type = props.type || "unknown";
        this.path = props.path;
        this.basePath = props.basePath;
        this.proxy = this.createProxy();
        this.$log = props.log;
        this.$api = props.api;
        this.$app = props.app;
        this.utils = utils_1.default;
        this.setLogger(props.logger, props.level);
        this.setApi(props.api);
        this.setApp(props.app);
    }
    /**
     * Get the app object
     * @returns {Object}
     */
    BaseApi.prototype.app = function () {
        return this.$app;
    };
    /**
     * Get the app object
     * @returns {Object}
     */
    BaseApi.prototype.api = function () {
        return this.$api;
    };
    /**
     * Get the log object
     * @returns {Object}
     */
    BaseApi.prototype.log = function () {
        return this.$log;
    };
    /**
     * Set the API to use
     * By default will use axios
     * @param {Object} api
     */
    BaseApi.prototype.setApi = function (api, headers) {
        if (headers === void 0) { headers = {}; }
        this.$api =
            api ||
                initDefaultApi({
                    baseURL: this.basePath,
                    headers: headers
                });
    };
    /**
     * Set the app
     * @param {Object} app
     */
    BaseApi.prototype.setApp = function (app) {
        if (app instanceof Object) {
            this.$app = app;
        }
    };
    /**
     * Set the logger to use
     * By default will use js-logger
     * @param {Object} logger
     */
    BaseApi.prototype.setLogger = function (logger, level) {
        this.$log = logger || logger_1.default.create(level);
    };
    /**
     * get the base path
     * @param {string} action
     * @param {Object} app
     * @param {Object} params
     */
    BaseApi.prototype.getBasePath = function (action, app, params) {
        return this.basePath;
    };
    /**
     * Create a magix API proxy obejct to dynamically access api methods.
     * All URLs are prefixed with the basepath
     * Call in the following ways:
     * // GET /
     *   this.proxy.get()
     *   // GET /users
     *   this.proxy.get${this.type}()
     *   // GET /users/1234/likes
     *   this.proxy.get${this.type}$Likes('1234')
     *   // GET /users/1234/likes?page=2
     *   this.proxy.get${this.type}$Likes('1234', { page: 2 })
     *   // POST /items with body
     *   this.proxy.postItems({ name: 'Item name' })
     * @returns {Proxy}
     * @memberof BaseApi
     */
    BaseApi.prototype.createProxy = function () {
        var instance = this;
        return new Proxy({}, {
            get: function (target, propKey) {
                var property = propKey ? propKey.toLowerCase() : "get";
                var method = instance.api().hasOwnProperty(property) ? property : null;
                if (!method)
                    return;
                var path = instance.getUrl(propKey) +
                    "/"
                        .substring(method.length)
                        .replace(/([a-z])([A-Z])/g, "$1/$2")
                        .replace(/\$/g, "/$/")
                        .toLowerCase();
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var finalPath = path.replace(/\$/g, function () { return args.shift(); });
                    var body = args.shift() || {};
                    var params = args.shift() || body;
                    if (["post", "put", "patch"].indexOf(method) !== -1) {
                        return instance.api()[property](finalPath, body, {
                            params: params
                        });
                    }
                    else {
                        return instance.api()[property](finalPath, {
                            params: params
                        });
                    }
                };
            }
        });
    };
    /**
     * Build an API getter
     *
     * @param {string} index
     * @param {string} _endPoint
     * @param {Object|int} params
     * @returns
     * @memberof BaseApi
     */
    BaseApi.prototype.getUrl = function (index, _endPoint, _params, basePath, app) {
        if (_endPoint === void 0) { _endPoint = null; }
        if (_params === void 0) { _params = null; }
        if (basePath === void 0) { basePath = null; }
        if (app === void 0) { app = null; }
        var params = (_params || {}).data || (_params || {});
        var paths = basePath ? [basePath] : [this.getBasePath(index, app || this.$app, params)];
        var endPoint = _endPoint || null;
        if (this.path instanceof Object) {
            if (this.path.hasOwnProperty(index)) {
                var getter = this.path[index];
                if (getter instanceof Function) {
                    var value = getter(app, params);
                    paths.push(value);
                }
                else {
                    paths.push(this.path.default, getter);
                }
            }
            else {
                paths.push(this.path.default, endPoint);
            }
        }
        else {
            paths.push(this.path, endPoint);
        }
        return paths.filter(function (value) { return !!value; }).join("/");
    };
    /**
     * Get the index configurataion for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    BaseApi.prototype.getIndexConfig = function (params, options) {
        var _this = this;
        var id = params instanceof Object ? params.id : params;
        this.log().info("[Services: " + this.type + "]: GetIndexConfig");
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .get("" + this.getUrl(getter || "getIndexConfig", endPoint || "index-config", params) + (id ? "/" + id : ""))
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": GetIndexConfig]:", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Get the form configuration for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    BaseApi.prototype.getFormConfig = function (params, options) {
        var _this = this;
        var id = params instanceof Object ? params.id : params;
        this.log().info("[Services: " + this.type + "]: GetFormConfig");
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        var idPart = id ? "/" + id : "";
        return this.api()
            .get("" + this.getUrl(getter || "getFormConfig", endPoint || "form-config", params) + idPart)
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": GetFormConfig]:", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Get all items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.getAll = function (params, options) {
        var _this = this;
        this.log().info("[Services: " + this.type + "]: Get All " + this.type, params);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .get(this.getUrl(getter || "getAll", endPoint || null, params), {
            params: params
        })
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Get All " + _this.type + "]:", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Get a single item
     *
     * @param {*} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.getOne = function (params, options) {
        var _this = this;
        var id = params instanceof Object ? params.id : params;
        this.log().info("[Services: " + this.type + "]: Get " + this.type, id);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .get(this.getUrl(getter || "getOne", endPoint || null, params) + "/" + id, {
            params: params
        })
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Get " + _this.type + "]: Error", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Save an item
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.save = function (params, options) {
        var _this = this;
        var id = params.id;
        var data = this.utils.createFormData(params);
        this.log().info("[Services: " + this.type + "]: Save " + this.type, params, data, id);
        var method = id ? "post" : "post";
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        var idPart = id ? "/" + id : "";
        return this.api()[method]("" + this.getUrl(getter || "save", endPoint || null, params.data || params) + idPart, data)
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Save " + _this.type + "]: Error", error.response);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Import many items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.import = function (params, options) {
        var _this = this;
        var data = this.utils.createFormData(params);
        this.log().info("[Services: " + this.type + "]: Import " + this.type, data);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .post(this.getUrl(getter || "import", endPoint || "import", params), data)
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Import]: Error", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Export many items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.export = function (params, options) {
        var _this = this;
        var data = this.utils.createFormData(params);
        this.log().info("[Services: " + this.type + "]: Export " + this.type, data);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .post(this.getUrl(getter || "export", endPoint || "export", params), data)
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Export]: Error", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Delete an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.delete = function (params, options) {
        var _this = this;
        var id = params.id || params;
        var urlParams = params.params || {};
        var bodyParams = params.body || {};
        var dataParams = params.data || {};
        this.log().info("[Services: " + this.type + "]: Delete " + this.type, id);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .delete(this.getUrl(getter || "delete", endPoint || null, params) + "/" + id, {
            params: urlParams,
            body: bodyParams,
            data: dataParams
        })
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Delete " + _this.type + "]: Error", error);
            throw _this.utils.resolveError(error);
        });
    };
    /**
     * Toggle an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    BaseApi.prototype.toggle = function (params, options) {
        var _this = this;
        var id = params.id || params;
        this.log().info("[Services: " + this.type + "]: Toggle " + this.type, id);
        var _a = options || {}, getter = _a.getter, endPoint = _a.endPoint;
        return this.api()
            .put(this.getUrl(getter || "toggle", endPoint || "toggle", params) + "/" + id)
            .catch(function (error) {
            _this.log().warn("[Services: " + _this.type + ": Toggle " + _this.type + "]: Error", error);
            throw _this.utils.resolveError(error);
        });
    };
    return BaseApi;
}());
exports.default = BaseApi;
