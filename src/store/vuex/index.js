import utils from './utils';
import BaseStore from '../_base_store';

// Store types
const coreTypes = {
    STORE_GET_INDEX_CONFIG: `STORE_GET_INDEX_CONFIG`,
    STORE_GET_FORM_CONFIG: `STORE_GET_FORM_CONFIG`,
    STORE_GET: `STORE_GET`,
    STORE_SET: `STORE_SET`,
    STORE_GET_ALL: `STORE_GET_ALL`,
    STORE_SET_ALL: `STORE_SET_ALL`,
    STORE_SAVE: `STORE_SAVE`,
    STORE_CREATE: `STORE_CREATE`,
    STORE_UPDATE: `STORE_UPDATE`,
    STORE_IMPORT: `STORE_IMPORT`,
    STORE_DELETE: `STORE_DELETE`,
    STORE_UPDATE_STATS: `STORE_UPDATE_STATS`,
    STORE_CREATE_CACHE_GET: `STORE_CREATE_CACHE_GET`,
    STORE_CREATE_CACHE_UPDATE: `STORE_CREATE_CACHE_UPDATE`,
    STORE_CREATE_CACHE_REMOVE: `STORE_CREATE_CACHE_REMOVE`
};

class Store extends BaseStore {

    constructor(_props) {
        const props = _props instanceof Object ? _props : {};
        super(props);
        this.utils = utils;
    }

    types(types) {
        const extend = types instanceof Object ? types : {};
        let localTypes = {};
        Object.keys(coreTypes).map((value, key) => {
            localTypes[value] = value;
        });
        return {
            ...localTypes,
            ...extend
        };
    }

    /**
     * Generate a state object
     *
     * @param {Object} state
     * @param {boolean} exclusive
     * @returns
     */
    state(state, exclusive) {
        const extend = state instanceof Object ? state : {};
        const baseState = exclusive === true ? {} : {
            config: {
                index: null,
                form: null
            },
            status: {
                data: ``
            },
            data: {
                data: []
            },
            all: [],
            imported: {
                data: []
            }
        };
        return {
            ...baseState,
            ...extend
        };
    }

    /**
     * Generate the getters for the store
     * @aram {Object}
     * @param {boolean} exclusive
     * @returns
     */
    getters(getters, exclusive) {
        const extend = getters instanceof Object ? getters : {};
        const baseGetters = exclusive === true ? {} : {
            config: state => state.config,
            indexConfig: state => state.config.index,
            formConfig: state => state.config.form,
            data: state => state.data,
            isAllLoaded: state => !!state.data.data.length,
            imported: state => state.imported
        };
        return {
            ...baseGetters,
            ...extend
        };
    }

    /**
     * Generate the actions for the store
     *
     * @param {Object} actions
     * @param {string} type
     * @param {boolean} exclusive
     * @returns
     */
    actions(actions, _type, exclusive) {
        let type = _type || 'unknown';
        type = type[0] + type.substr(1);
        const extend = actions instanceof Object ? actions : {};
        const baseActions = exclusive === true ? {} : {
            ...{
                /**
                 * Get the index page config for the given type
                 * @param {Object} context
                 * @param {Object} params
                 * @param {boolean} force
                 * @returns {Promise}
                 */
                getIndexConfig(context, params, force) {
                    const forceGet = force || true;
                    return new Promise((resolve, reject) => {
                        if (!context.state.config.index || forceGet) {
                            this.$log.info(`[Store: ${type}]: GetIndexConfig`);
                            return api.getIndexConfig(params).then((response) => {
                                context.commit(coreTypes.STORE_GET_INDEX_CONFIG, response.data.data);
                                resolve(context.state.config.index);
                            })
                        } else {
                            this.$log.info(`[Store: ${type}]: Getting existing index config`, params)
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
                getFormConfig(context, params, force) {
                    const forceGet = force || true;
                    return new Promise((resolve, reject) => {
                        if (!context.state.config.form || forceGet) {
                            this.$log.info(`[Store: ${type}]: GetFormConfig`);
                            return api.getFormConfig(params).then((response) => {
                                context.commit(coreTypes.STORE_GET_FORM_CONFIG, response.data.data);
                                resolve(context.state.config.form);
                            })
                        } else {
                            this.$log.info(`[Store: ${type}]: Getting existing form config`, params);
                            resolve(context.state.config.form);
                        }
                    });
                },
                /**
                 * Get all of the items
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                getAll(context, params) {
                    this.$log.info(`[Store: ${type}]: Get ${type}`, params);
                    return new Promise((resolve, reject) => {
                        return api.getAll(params).then((response) => {
                            this.$log.info(`[Store: ${type}]: Got all ${type}`, response.data);
                            context.commit(coreTypes.STORE_GET_ALL, {
                                params,
                                result: response.data
                            });
                            resolve(context.getters.data);
                        }).catch((error) => {
                            this.$log.info(`[Store: ${type}]: Error getting all`, error);
                            reject(error);
                        })
                    });
                },
                /**
                 * Set the data for the given type
                 * @param {Object} context
                 * @param {any} data
                 */
                setAll(context, data) {
                    this.$log.info(`[Store: ${type}]: Set data ${type}`, data)
                    return new Promise((resolve, reject) => {
                        context.commit(coreTypes.STORE_SET_ALL, {
                            type,
                            context,
                            data,
                            result: data
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
                getOne(context, id) {
                    this.$log.info(`[Store: ${type}]: Get ${type}`, id)
                    return new Promise((resolve, reject) => {
                        this.$log.info(`[Store: ${type}]: Getting ${type}`, id);
                        if (id) {
                            return api.getOne(id).then((response) => {
                                context.commit(coreTypes.STORE_GET, {
                                    params: id,
                                    result: response.data.data
                                });
                                resolve(response.data.data);
                            }).catch((error) => {
                                reject(error);
                            });
                        } else {
                            resolve({});
                        }
                    })
                },
                /**
                 * Set the given object in the local store
                 * @param {Object} context
                 * @param {any} data
                 * @returns {Promise}
                 */
                setOne(context, data) {
                    this.$log.info(`[Store: ${type}]: Set one ${type}`, params)
                    return new Promise((resolve, reject) => {
                        context.commit(coreTypes.STORE_SET, {
                            type,
                            context,
                            params,
                            result: data
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
                getOneCached(context, id) {
                    this.$log.info(`[Store: ${type}]: GetOneCached`, id)
                    return new Promise((resolve, reject) => {
                        if (utils.findItemInState(state, id) === -1) {
                            return this.getOneCahced(context, id);
                        } else {
                            this.$log.info(`[Store: ${type}]: Getting existing ${type}`, id);
                            resolve(utils.getItemInState(state, id));
                        }
                    })
                },
                /**
                 * Save the given data to the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                save(context, params) {
                    this.$log.info(`[Store: ${type}]: Save ${type}`, params)
                    return new Promise((resolve, reject) => {
                        return api.save(params).then((response) => {
                            this.$log.info(`[Store: ${type}]: Saved ${type}`, response);
                            const data = response.data.data;
                            context.commit(coreTypes.STORE_SAVE, {
                                type,
                                context,
                                params,
                                result: data
                            });
                            resolve(data);
                        }).catch((error) => {
                            this.$log.info(`[Store: ${type}]: Error Saving ${type}`, error);
                            reject(error);
                        })
                    });
                },
                /**
                 * Import the given data into the store
                 * @param {Object} context
                 * @param {Object} params
                 * @returns {Promise}
                 */
                import(context, params) {
                    this.$log.info(`[Store: ${type}]: Import`, params);
                    return new Promise((resolve, reject) => {
                        return api.import(params).then((response) => {
                            this.$log.info(`[Store: ${type}]: Imported`, response);
                            const data = response.data;
                            context.commit(coreTypes.STORE_IMPORT, data);
                            resolve(data);
                        }).catch((error) => {
                            this.$log.info(`[Store: ${type}]: Error Importing`, error);
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
                delete(context, params) {
                    this.$log.info(`[Store: ${type}]: Delete ${type}`, params);
                    return new Promise((resolve, reject) => {
                        if (params) {
                            return api.delete(params).then((response) => {
                                this.$log.info(`[Store: ${type}]: Deleted ${type}`, response.data.data);
                                context.commit(coreTypes.STORE_DELETE, {
                                    type,
                                    context,
                                    params: params,
                                    result: response.data.data
                                });
                                resolve(response.data.data);
                            }).catch((error) => {
                                reject(error);
                            });
                        } else {
                            reject(`[Store: ${type}]: Null params`);
                        }
                    });
                },
                /**
                 * Toggle the given data from the store
                 * @param {Object} context
                 * @param {any} params
                 * @returns {Promise}
                 */
                toggle(context, params, attr) {
                    this.$log.info(`[Store: ${type}]: Toggle ${type}`, params)
                    return new Promise((resolve, reject) => {
                        return api.toggle(params).then((response) => {
                            this.$log.info(`[Store: ${type}]: Toggled ${type}`, response);
                            const data = response.data.data;
                            context.commit(coreTypes.STORE_SAVE, {
                                type,
                                context,
                                params,
                                result: data
                            });
                            resolve(data);
                        }).catch((error) => {
                            this.$log.info(`[Store: ${type}]: Error Toggling ${type}`, error);
                            reject(error);
                        })
                    });
                }
            }
        }

        return {
            ...{
                type() {
                    return type;
                }
            },
            ...baseActions,
            ...extend
        };
    }

    /**
     * Generate the mutations for the store
     *
     * @param {Object} mutations
     * @param {Object} state
     * @returns
     */
    mutations(mutations, types, state) {
        const extend = mutations instanceof Object ? mutations : {};
        const _TYPES = this.types(types);

        return {
            ...{
                [_TYPES.STORE_GET_FORM_CONFIG](state, config) {
                    state.config.form = config;
                },
                [_TYPES.STORE_GET_INDEX_CONFIG](state, config) {
                    state.config.index = config;
                },
                [_TYPES.STORE_GET](state, data) {
                    utils.addToStateData(state, data.result);
                    return data;
                },
                [_TYPES.STORE_SET](state, data) {
                    utils.addToStateData(state, data.result);
                    return data;
                },
                [_TYPES.STORE_SAVE](state, data) {
                    // Only update if this is a new item
                    if (data.context) {
                        utils.updateStats(data.context, data.params.id ? 0 : 1, data.type);
                    }
                    utils.addToStateData(state, data.result);
                    return data;
                },
                [_TYPES.STORE_IMPORT](state, data) {
                    state.imported = data;
                    state.data.data.push([...data.data]);
                    state.all = state.all.concat(data.data);
                    return data;
                },
                [_TYPES.STORE_CREATE](state, data) {
                    utils.addToStateData(state, data.result);
                    return data;
                },
                [_TYPES.STORE_UPDATE](state, data) {
                    utils.updateStateData(state, data.result);
                    return data;
                },
                [_TYPES.STORE_UPDATE_STATS](state, data) {
                    if (data.context) {
                        utils.updateStats(state, data.value, data.type);
                    }
                },
                [_TYPES.STORE_GET_ALL](state, data) {
                    state.data = data.result;
                    state.all = state.all.concat(data.result.data);
                    return data;
                },
                [_TYPES.STORE_SET_ALL](state, data) {
                    state.data = data;
                    state.all = state.all.concat(data);
                    return data;
                },
                [_TYPES.STORE_DELETE](state, data) {
                    utils.removeFromStateData(state, data.params);
                    if (data.context) {
                        utils.updateStats(data.context, -1, data.type);
                    }
                },
                [_TYPES.STORE_CREATE_CACHE_GET](state, options) {
                    return state.cachedCreateStore;
                },
                [_TYPES.STORE_CREATE_CACHE_UPDATE](state, data) {
                    state.cachedCreateStore = Object.assign(state.cachedCreateStore || {}, data);
                    let window = window || null;
                    if (window && window instanceof Object) {
                        window.localStorage.setItem(`cachedCreate${type}`, JSON.stringify(state.cachedCreateStore));
                    }
                },
                [_TYPES.STORE_CREATE_CACHE_REMOVE](state) {
                    state.cachedCreateStore = null;
                    let window = window || null;
                    if (window && window instanceof Object) {
                        window.localStorage.removeItem(`cachedCreate${type}`);
                    }
                }
            },
            ...extend
        };
    }
}

export default Store;