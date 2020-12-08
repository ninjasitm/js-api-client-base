"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    resolveError: function (error, reject) {
        var data = error.response ? error.response.data : error;
        if (data.error) {
            // The request was made, but the server responded with a status code
            data = data.error.message || (data.error.errors ? data.error.errors.message : null) || data.error;
        }
        else {
            // Something happened in setting up the request that triggered an Error
            data = data.data || data.message || data.exception || data;
        }
        var result = error.response && error.response.data.errors ? Object.assign({}, {
            code: error.response.status
        }, error.response.data) : {
            code: error.response ? error.response.status : error.status,
            message: data
        };
        return result;
    },
    flattenObject: function (data, addToKey) {
        addToKey = addToKey || 'filter';
        var result = {};
        var flattenObjectLocal = function (object, parent) {
            if (object) {
                for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
                    var k = _a[_i];
                    var fullKey = k;
                    if (parent !== undefined) {
                        fullKey = parent + '[' + fullKey + ']';
                    }
                    // fullKey = `[${addToKey}]${fullKey}`;
                    if (object[k] instanceof File || object[k] instanceof Date) {
                        result[fullKey] = object[k];
                    }
                    else if (typeof object[k] === 'object') {
                        flattenObjectLocal(object[k], fullKey);
                    }
                    else {
                        result[fullKey] = object[k];
                    }
                }
            }
        };
        flattenObjectLocal(data, addToKey);
        return result;
    },
    createFormData: function (data) {
        if (!data.hasFiles) {
            return data.data || data;
        }
        else {
            var result_1 = {};
            var formData = new FormData();
            var objectToFormData_1 = function (object, parent) {
                if (parent === void 0) { parent = ''; }
                if (object) {
                    if (object instanceof Array) {
                        if (!object.length && parent) {
                            result_1[parent + "[]"] = null;
                        }
                        else {
                            object.forEach(function (v, k) {
                                var fullKey = k;
                                if (parent !== undefined) {
                                    fullKey = parent + '[' + fullKey + ']';
                                }
                                if (object[k] instanceof File ||
                                    object[k] instanceof Date) {
                                    result_1[fullKey] = object[k];
                                }
                                else if (object[k] instanceof Object) {
                                    objectToFormData_1(object[k], fullKey);
                                }
                                else {
                                    result_1[fullKey] = object[k];
                                }
                            });
                        }
                    }
                    else {
                        for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
                            var k = _a[_i];
                            var fullKey = k;
                            if (parent !== undefined) {
                                fullKey = parent + '[' + fullKey + ']';
                            }
                            if (object[k] instanceof File ||
                                object[k] instanceof Date) {
                                result_1[fullKey] = object[k];
                            }
                            else if (object[k] instanceof Object) {
                                objectToFormData_1(object[k], fullKey);
                            }
                            else {
                                result_1[fullKey] = object[k];
                            }
                        }
                    }
                }
            };
            objectToFormData_1(data.data);
            for (var _i = 0, _a = Object.keys(result_1); _i < _a.length; _i++) {
                var k = _a[_i];
                var value = result_1[k] === null || result_1[k] === undefined || result_1[k] === 'null' ? '' : result_1[k];
                formData.append(k, value);
            }
            return formData;
        }
    },
    printFormData: function (formData) {
        for (var _i = 0, _a = formData.entries(); _i < _a.length; _i++) {
            var pair = _a[_i];
            console.info(pair[0] + ': ' + pair[1]);
        }
    },
    objectValues: function (object) {
        return Object.keys(object).map(function (key) { return object[key]; });
    },
    getCookie: function (name) {
        var match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match)
            return match[1];
    }
};
