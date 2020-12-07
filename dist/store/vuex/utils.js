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
var utils_1 = __importDefault(require("../../services/utils"));
var utils = __assign(__assign({}, utils_1.default), {
    addToStateData: function (state, originalItem, stateIsTarget, push) {
        if (stateIsTarget === void 0) { stateIsTarget = true; }
        if (push === void 0) { push = false; }
        var addData = function (_state, _item) {
            if (_state instanceof Array) {
                var filteredState = _state.filter(function (c) { return c instanceof Object; });
                var index = filteredState.findIndex(function (current) { return current instanceof Object && current.id === _item.id; });
                if (index > -1) {
                    var existing = filteredState.find(function (current) { return current instanceof Object && current.id === _item.id; });
                    if (existing instanceof Object) {
                        _state.splice(index, 1, __assign(__assign({}, existing), _item));
                    }
                    else {
                        _state.splice(index, 1, _item);
                    }
                }
                else if (push) {
                    _state.push(_item);
                }
                else {
                    _state.unshift(_item);
                }
            }
        };
        var items = originalItem instanceof Array ? originalItem : [originalItem];
        items.forEach(function (item) {
            if (stateIsTarget === true) {
                addData(state, item);
            }
            else {
                addData(state.data.data, item);
                state.all.push(item);
                state.data.total = state.data.data.length;
            }
        });
    },
    updateStateData: function (state, originalItem, stateIsTarget, addToState) {
        if (stateIsTarget === void 0) { stateIsTarget = true; }
        if (addToState === void 0) { addToState = false; }
        var items = originalItem instanceof Array ? originalItem : [originalItem];
        var updateData = function (_state, _item) {
            var filteredState = _state.filter(function (c) { return c instanceof Object; });
            var index = filteredState.findIndex(function (current) { return current instanceof Object && current.id === _item.id; });
            if (_state instanceof Array) {
                var filteredState_1 = _state.filter(function (c) { return c instanceof Object; });
                var index_1 = filteredState_1.findIndex(function (current) { return current instanceof Object && current.id === _item.id; });
                if (index_1 > -1) {
                    var existing = filteredState_1.find(function (current) { return current instanceof Object && current.id === _item.id; });
                    if (existing instanceof Object) {
                        _state.splice(index_1, 1, __assign(__assign({}, existing), _item));
                    }
                    else {
                        _state.splice(index_1, 1, _item);
                    }
                }
                else if (addToState) {
                    utils.addToStateData(state, _item, stateIsTarget);
                }
            }
        };
        items.forEach(function (item) {
            if (stateIsTarget === true) {
                updateData(state, item);
            }
            else {
                updateData(state.data.data, item);
            }
        });
    },
    removeFromStateData: function (state, originalItem, stateIsTarget) {
        if (stateIsTarget === void 0) { stateIsTarget = true; }
        var items = originalItem instanceof Array ? originalItem : [originalItem];
        var removeData = function (_state, _item) {
            var index = _state.findIndex(function (current) {
                if (current instanceof Object) {
                    return current.id === _item;
                }
                else if (_item instanceof Function) {
                    return _item(current);
                }
                else {
                    return current === _item;
                }
            });
            if (index > -1) {
                _state.splice(index, 1);
            }
        };
        items.forEach(function (item) {
            var id = item instanceof Object ? item.id : item;
            if (stateIsTarget === true) {
                removeData(state, id);
            }
            else {
                removeData(state.data.data, id);
                state.data.total = state.data.data.length;
            }
        });
    },
    findItemInState: function (state, item, stateIsTarget) {
        if (stateIsTarget === void 0) { stateIsTarget = true; }
        var itemId = item instanceof Object ? item.id : item;
        if (stateIsTarget === true) {
            return state.findIndex(function (current) { return current instanceof Object && current.id == itemId; });
        }
        else {
            return state.data.data.findIndex(function (current) { return current instanceof Object && current.id == itemId; });
        }
    },
    getItemInState: function (state, item, stateIsTarget) {
        if (stateIsTarget === void 0) { stateIsTarget = true; }
        var itemId = item instanceof Object ? item.id : item;
        if (stateIsTarget === true) {
            return state.find(function (current) { return current.id == itemId; });
        }
        else {
            return state.data.data.find(function (current) { return current instanceof Object && current.id == itemId; });
        }
    }
});
exports.default = utils;
