"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = __importDefault(require("./utils"));
var _base_store_1 = __importDefault(require("../_base_store"));
// Store types
var coreTypes = {
    STORE_GET_INDEX_CONFIG: "STORE_GET_INDEX_CONFIG",
    STORE_GET_FORM_CONFIG: "STORE_GET_FORM_CONFIG",
    STORE_GET: "STORE_GET",
    STORE_SET: "STORE_SET",
    STORE_SET_APPENDS_DATA: "STORE_SET_APPENDS_DATA",
    STORE_GET_ALL: "STORE_GET_ALL",
    STORE_SET_ALL: "STORE_SET_ALL",
    STORE_SAVE: "STORE_SAVE",
    STORE_DUPLICATE: "STORE_DUPLICATE",
    STORE_CREATE: "STORE_CREATE",
    STORE_UPDATE: "STORE_UPDATE",
    STORE_IMPORT: "STORE_IMPORT",
    STORE_EXPORT: "STORE_EXPORT",
    STORE_DELETE: "STORE_DELETE",
    STORE_UPDATE_STATS: "STORE_UPDATE_STATS",
    STORE_CREATE_CACHE_GET: "STORE_CREATE_CACHE_GET",
    STORE_CREATE_CACHE_UPDATE: "STORE_CREATE_CACHE_UPDATE",
    STORE_CREATE_CACHE_REMOVE: "STORE_CREATE_CACHE_REMOVE",
};
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(props) {
        if (props === void 0) { props = {}; }
        var _this = _super.call(this, props) || this;
        _this.utils = utils_1.default;
        _this.coreTypes = coreTypes;
        return _this;
    }
    /**
     * Generate the modules dynamically
     * @param {Object} modules
     */
    Store.prototype.generateModules = function (modules) {
        var _this = this;
        var allModules = {};
        Object.keys(modules).map(function (module) {
            var clone = _.clone(_this, true);
            var moduleObject = modules[module](clone);
            moduleObject.log = _this.log;
            moduleObject.app = _this.app;
            moduleObject.api = _this.api;
            allModules[module] = moduleObject;
        });
        return allModules;
    };
    Store.prototype.types = function (types) {
        var extend = types instanceof Object ? types : {};
        var localTypes = {};
        Object.keys(coreTypes).map(function (value, key) {
            localTypes[value] = value;
        });
        this.allTypes = __assign(__assign({}, localTypes), extend);
        return this.allTypes;
    };
    /**
     * Generate a state object
     *
     * @param {Object} state
     * @param {boolean} exclusive
     * @returns
     */
    Store.prototype.state = function (state, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        var extend = state instanceof Object ? state : {};
        var baseState = exclusive === true
            ? {}
            : {
                config: {
                    index: null,
                    form: null,
                },
                status: {
                    data: "",
                },
                appendData: false,
                data: {
                    data: [],
                },
                all: [],
                imported: {
                    data: [],
                },
                exported: {
                    data: [],
                },
            };
        return __assign(__assign({}, baseState), extend);
    };
    /**
     * Generate the getters for the store
     * @aram {Object}
     * @param {boolean} exclusive
     * @returns
     */
    Store.prototype.getters = function (getters, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        var extend = getters instanceof Object ? getters : {};
        var baseGetters = exclusive === true
            ? {}
            : {
                config: function (state) { return state.config; },
                indexConfig: function (state) { return state.config.index; },
                formConfig: function (state) { return state.config.form; },
                data: function (state) { return state.data; },
                isAllLoaded: function (state) {
                    return state.data instanceof Object &&
                        state.data.data instanceof Array &&
                        state.data.data.length > 0;
                },
                imported: function (state) { return state.imported; },
            };
        var $log = this.$log;
        return __assign(__assign({
            log: function () {
                return $log;
            },
        }, baseGetters), extend);
    };
    /**
     * Generate the actions for the store
     *
     * @param {Object} actions
     * @param {string} type
     * @param {boolean} exclusive
     * @param {Object} api
     * @returns
     */
    Store.prototype.actions = function (actions, _type, exclusive) {
        if (_type === void 0) { _type = "unknown"; }
        if (exclusive === void 0) { exclusive = false; }
        var api = this.api();
        var log = this.log();
        var type = _type;
        type = type[0] + type.substr(1);
        var extend = actions instanceof Object ? actions : {};
        var baseActions = exclusive === true
            ? {}
            : __assign({
                /**
                 * Get the index page config for the given type
                 * @param {Object} context
                 * @param {Object} params
                 * @param {boolean} force
                 * @returns {Promise}
                 */
                getIndexConfig: function (context, params, force) {
                    if (params === void 0) { params = {}; }
                    if (force === void 0) { force = false; }
                    var forceGet = force || true;
                    return new Promise(function (resolve, reject) {
                        if (!context.state.config.index || forceGet) {
                            log.info("[Store: " + type + "]: GetIndexConfig");
                            return api.getIndexConfig(params).then(function (response) {
                                context.commit(coreTypes.STORE_GET_INDEX_CONFIG, response.data.data);
                                resolve(context.state.config.index);
                            });
                        }
                        else {
                            log.info("[Store: " + type + "]: Getting existing index config", params);
                            resolve(context.state.config.index);
                        }
                    });
                },
                /**
                 * Get the form config needed for creating or updating models
                 * @param {Object} context
                 * @param {object} params
                 * @param {boolean} force
                 * @returns {Promise}
                 */
                getFormConfig: function (context, params, force) {
                    if (params === void 0) { params = {}; }
                    if (force === void 0) { force = false; }
                    var forceGet = force || true;
                    return new Promise(function (resolve, reject) {
                        if (!context.state.config.form || forceGet) {
                            log.info("[Store: " + type + "]: GetFormConfig");
                            return api.getFormConfig(params).then(function (response) {
                                context.commit(coreTypes.STORE_GET_FORM_CONFIG, response.data.data);
                                resolve(context.state.config.form);
                            });
                        }
                        else {
                            log.info("[Store: " + type + "]: Getting existing form config", params);
                            resolve(context.state.config.form);
                        }
                    });
                },
                /**
                 * Set the ability to append data to existing data
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                setAppendsData: function (context, params) {
                    if (params === void 0) { params = {}; }
                    log.info("[Store: " + type + "]: Set Appends Data " + type, params);
                    return Promise.resolve(context.commit(coreTypes.STORE_SET_APPENDS_DATA, params));
                },
                /**
                 * Get all of the items
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                getAll: function (context, params) {
                    if (params === void 0) { params = {}; }
                    log.info("[Store: " + type + "]: Get " + type, params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .getAll(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Got all " + type, response.data);
                            context.commit(coreTypes.STORE_GET_ALL, {
                                params: params,
                                result: response.data,
                            });
                            resolve(context.getters.data);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error getting all", error);
                            reject(error);
                        });
                    });
                },
                /**
                 * Set the data for the given type
                 * @param {Object} context
                 * @param {any} data
                 */
                setAll: function (context, data) {
                    if (data === void 0) { data = {}; }
                    log.info("[Store: " + type + "]: Set data " + type, data);
                    return new Promise(function (resolve, reject) {
                        context.commit(coreTypes.STORE_SET_ALL, {
                            type: type,
                            context: context,
                            data: data,
                            result: data,
                        });
                        resolve(data);
                    });
                },
                /**
                 * Get the specific object with the given id
                 * @param {Object} context
                 * @param {number|string} id
                 * @returns {Promise}
                 */
                getOne: function (context, id) {
                    if (id === void 0) { id = {}; }
                    log.info("[Store: " + type + "]: Get " + type, id);
                    return new Promise(function (resolve, reject) {
                        log.info("[Store: " + type + "]: Getting " + type, id);
                        if (id) {
                            return api
                                .getOne(id)
                                .then(function (response) {
                                var result = response.data.hasOwnProperty("meta")
                                    ? {
                                        meta: response.data.meta,
                                        data: response.data.data,
                                    }
                                    : response.data.data;
                                context.commit(coreTypes.STORE_GET, {
                                    params: id,
                                    result: result,
                                });
                                resolve(result);
                            })
                                .catch(function (error) {
                                reject(error);
                            });
                        }
                        else {
                            resolve({});
                        }
                    });
                },
                /**
                 * Set the given object in the local store
                 * @param {Object} context
                 * @param {any} data
                 * @returns {Promise}
                 */
                setOne: function (context, data) {
                    if (data === void 0) { data = {}; }
                    log.info("[Store: " + type + "]: Set one " + type, data);
                    return new Promise(function (resolve, reject) {
                        context.commit(coreTypes.STORE_SET, {
                            type: type,
                            context: context,
                            data: data,
                            result: data,
                        });
                        resolve(data);
                    });
                },
                /**
                 * Get the specific object with the given id in the lcoal cache
                 * @param {Object} context
                 * @param {number|string} id
                 * @returns {Promise}
                 */
                getOneCached: function (context, id) {
                    var _this = this;
                    log.info("[Store: " + type + "]: GetOneCached", id);
                    return new Promise(function (resolve, reject) {
                        if (utils_1.default.findItemInState(context.state, id) === -1) {
                            return _this.getOneCached(context, id);
                        }
                        else {
                            log.info("[Store: " + type + "]: Getting existing " + type, id);
                            resolve(utils_1.default.getItemInState(context.state, id));
                        }
                    });
                },
                /**
                 * Save the given data to the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                save: function (context, params) {
                    log.info("[Store: " + type + "]: Save " + type, params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .save(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Saved " + type, response);
                            var data = response.data;
                            context.commit(coreTypes.STORE_SAVE, {
                                type: type,
                                context: context,
                                params: params,
                                result: data,
                            });
                            resolve(data);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error Saving " + type, error);
                            reject(error);
                        });
                    });
                },
                /**
                 * Duplicate the given data to the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                duplicate: function (context, params) {
                    log.info("[Store: " + type + "]: Duplicate " + type, params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .duplicate(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Duplicated " + type, response);
                            var data = response.data;
                            context.commit(coreTypes.STORE_DUPLICATE, {
                                type: type,
                                context: context,
                                params: params,
                                result: data,
                            });
                            resolve(data);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error Duplicating " + type, error);
                            reject(error);
                        });
                    });
                },
                /**
                 * Import the given data into the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                import: function (context, params) {
                    log.info("[Store: " + type + "]: Import", params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .import(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Imported", response);
                            var data = response.data;
                            context.commit(coreTypes.STORE_IMPORT, data);
                            resolve(data);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error Importing", error);
                            reject(error);
                        });
                    });
                },
                /**
                 * Export the given data into the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                export: function (context, params) {
                    log.info("[Store: " + type + "]: Export", params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .export(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Exported", response);
                            var data = response.data;
                            context.commit(coreTypes.STORE_IMPORT, data);
                            resolve(data);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error Exporting", error);
                            reject(error);
                        });
                    });
                },
                /**
                 * Delete the given data from the store
                 * @param {Object} context
                 * @param {any} params
                 * @returns {Promise}
                 */
                delete: function (context, params) {
                    log.info("[Store: " + type + "]: Delete " + type, params);
                    return new Promise(function (resolve, reject) {
                        if (params) {
                            return api
                                .delete(params)
                                .then(function (response) {
                                log.info("[Store: " + type + "]: Deleted " + type, response.data.data);
                                context.commit(coreTypes.STORE_DELETE, {
                                    type: type,
                                    context: context,
                                    params: params,
                                    result: response.data.data,
                                });
                                resolve(response.data.data);
                            })
                                .catch(function (error) {
                                reject(error);
                            });
                        }
                        else {
                            reject("[Store: " + type + "]: Null params");
                        }
                    });
                },
                /**
                 * Toggle the given data from the store
                 * @param {Object} context
                 * @param {any} params
                 * @returns {Promise}
                 */
                toggle: function (context, params, attr) {
                    log.info("[Store: " + type + "]: Toggle " + type, params);
                    return new Promise(function (resolve, reject) {
                        return api
                            .toggle(params)
                            .then(function (response) {
                            log.info("[Store: " + type + "]: Toggled " + type, response);
                            var result = response.data.hasOwnProperty("meta")
                                ? {
                                    meta: response.data.meta,
                                    data: response.data.data,
                                }
                                : response.data.data;
                            context.commit(coreTypes.STORE_SAVE, {
                                type: type,
                                context: context,
                                params: params,
                                result: result,
                            });
                            resolve(result);
                        })
                            .catch(function (error) {
                            log.info("[Store: " + type + "]: Error Toggling " + type, error);
                            reject(error);
                        });
                    });
                },
            });
        return __assign(__assign({
            type: function () {
                return type;
            },
            log: function () {
                return log;
            },
        }, baseActions), extend);
    };
    /**
     * Generate the mutations for the store
     *
     * @param {Object} mutations
     * @param {Object} state
     * @returns
     */
    Store.prototype.mutations = function (mutations, types, state) {
        var _a;
        var extend = mutations instanceof Object ? mutations : {};
        var _TYPES = this.types(types);
        var log = this.log();
        return __assign(__assign({
            log: function () {
                return log;
            },
        }, (_a = {},
            _a[_TYPES.STORE_UPDATE_STATS] = function (state, stats) {
                return stats;
            },
            _a[_TYPES.STORE_GET_FORM_CONFIG] = function (state, config) {
                state.config.form = config;
            },
            _a[_TYPES.STORE_GET_INDEX_CONFIG] = function (state, config) {
                state.config.index = config;
            },
            _a[_TYPES.STORE_GET] = function (state, data) {
                utils_1.default.addToStateData(state, data.result.data || data.result);
                return data;
            },
            _a[_TYPES.STORE_SET] = function (state, data) {
                utils_1.default.addToStateData(state, data.result.data || data.result);
                return data;
            },
            _a[_TYPES.STORE_SAVE] = function (state, data) {
                // Only update if this is a new item
                utils_1.default.addToStateData(state, data.result.data || data.result);
                return data;
            },
            _a[_TYPES.STORE_DUPLICATE] = function (state, data) {
                // Only update if this is a new item
                utils_1.default.addToStateData(state, data.result.data || data.result);
                return data;
            },
            _a[_TYPES.STORE_IMPORT] = function (state, data) {
                state.imported = data;
                if (data.data instanceof Array) {
                    state.data.data.push(__spreadArrays(data.data));
                    state.all = state.all.concat(data.data);
                }
                return data;
            },
            _a[_TYPES.STORE_EXPORT] = function (state, data) {
                state.exported = data;
                return data;
            },
            _a[_TYPES.STORE_CREATE] = function (state, data) {
                utils_1.default.addToStateData(state, data.result);
                return data;
            },
            _a[_TYPES.STORE_UPDATE] = function (state, data) {
                utils_1.default.updateStateData(state, data.result);
                return data;
            },
            _a[_TYPES.STORE_SET_APPENDS_DATA] = function (state, data) {
                state.appendData = !!data;
            },
            _a[_TYPES.STORE_GET_ALL] = function (state, data) {
                if (state.appendData) {
                    state.data = __assign(__assign({}, data.result), { data: {
                            data: state.data.data.concat(data.result.data),
                        } });
                }
                else {
                    state.data = data.result;
                }
                //   state.all = state.all.concat(data.result.data);
                return data;
            },
            _a[_TYPES.STORE_SET_ALL] = function (state, data) {
                state.data = data;
                state.all = state.all.concat(data);
                return data;
            },
            _a[_TYPES.STORE_DELETE] = function (state, data) {
                utils_1.default.removeFromStateData(state, data.params);
            },
            _a[_TYPES.STORE_CREATE_CACHE_GET] = function (state, options) {
                return state.cachedCreateStore;
            },
            _a[_TYPES.STORE_CREATE_CACHE_UPDATE] = function (state, data, type) {
                state.cachedCreateStore = Object.assign(state.cachedCreateStore || {}, data);
                var realWindow = typeof window !== "undefined" ? window : null;
                if (realWindow && realWindow instanceof Object) {
                    realWindow.localStorage.setItem("cachedCreate" + type, JSON.stringify(state.cachedCreateStore));
                }
            },
            _a[_TYPES.STORE_CREATE_CACHE_REMOVE] = function (state, type) {
                state.cachedCreateStore = null;
                var realWindow = typeof window !== "undefined" ? window : null;
                if (realWindow && realWindow instanceof Object) {
                    realWindow.localStorage.removeItem("cachedCreate" + type);
                }
            },
            _a)), extend);
    };
    return Store;
}(_base_store_1.default));
exports.default = Store;
