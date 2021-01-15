const _ = require("lodash");
import utils from "./utils";
import BaseStore from "../_base_store";
import { IStore } from "../../types";

// Store types
const coreTypes = {
  STORE_GET_INDEX_CONFIG: `STORE_GET_INDEX_CONFIG`,
  STORE_GET_FORM_CONFIG: `STORE_GET_FORM_CONFIG`,
  STORE_GET: `STORE_GET`,
  STORE_SET: `STORE_SET`,
  STORE_SET_APPENDS_DATA: "STORE_SET_APPENDS_DATA",
  STORE_GET_ALL: `STORE_GET_ALL`,
  STORE_SET_ALL: `STORE_SET_ALL`,
  STORE_SAVE: `STORE_SAVE`,
  STORE_CREATE: `STORE_CREATE`,
  STORE_UPDATE: `STORE_UPDATE`,
  STORE_IMPORT: `STORE_IMPORT`,
  STORE_EXPORT: `STORE_EXPORT`,
  STORE_DELETE: `STORE_DELETE`,
  STORE_UPDATE_STATS: `STORE_UPDATE_STATS`,
  STORE_CREATE_CACHE_GET: `STORE_CREATE_CACHE_GET`,
  STORE_CREATE_CACHE_UPDATE: `STORE_CREATE_CACHE_UPDATE`,
  STORE_CREATE_CACHE_REMOVE: `STORE_CREATE_CACHE_REMOVE`,
};

class Store extends BaseStore implements IStore {
  coreTypes: object;
  utils: any;

  constructor(props: any = {}) {
    super(props);
    this.utils = utils;
    this.coreTypes = coreTypes;
  }

  /**
   * Generate the modules dynamically
   * @param {Object} modules
   */
  generateModules(modules: any) {
    const allModules: any = {};
    Object.keys(modules).map((module: string) => {
      const clone = _.clone(this, true);
      const moduleObject = modules[module](clone);
      moduleObject.log = this.log;
      moduleObject.app = this.app;
      moduleObject.api = this.api;
      allModules[module] = moduleObject;
    });
    return allModules;
  }

  types(types: object) {
    const extend = types instanceof Object ? types : {};
    let localTypes: any = {};
    Object.keys(coreTypes).map((value, key) => {
      localTypes[value] = value;
    });
    this.allTypes = {
      ...localTypes,
      ...extend,
    };
    return this.allTypes;
  }

  /**
   * Generate a state object
   *
   * @param {Object} state
   * @param {boolean} exclusive
   * @returns
   */
  state(state: object, exclusive: boolean = false) {
    const extend = state instanceof Object ? state : {};
    const baseState =
      exclusive === true ?
      {} :
      {
        config: {
          index: null,
          form: null,
        },
        status: {
          data: ``,
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
    return {
      ...baseState,
      ...extend,
    };
  }

  /**
   * Generate the getters for the store
   * @aram {Object}
   * @param {boolean} exclusive
   * @returns
   */
  getters(getters: object, exclusive: boolean = false) {
    const extend = getters instanceof Object ? getters : {};
    const baseGetters =
      exclusive === true ?
      {} :
      {
        config: (state: any) => state.config,
        indexConfig: (state: any) => state.config.index,
        formConfig: (state: any) => state.config.form,
        data: (state: any) => state.data,
        isAllLoaded: (state: any): boolean =>
          state.data instanceof Object &&
          state.data.data instanceof Array &&
          state.data.data.length > 0,
        imported: (state: any) => state.imported,
      };
    const $log = this.$log;
    return {
      ...{
        log() {
          return $log;
        },
      },
      ...baseGetters,
      ...extend,
    };
  }

  /**
   * Generate the actions for the store
   *
   * @param {Object} actions
   * @param {string} type
   * @param {boolean} exclusive
   * @param {Object} api
   * @returns
   */
  actions(actions: object, _type: string = 'unknown', exclusive: boolean = false) {
    const api = this.api();
    const log = this.log();
    let type = _type;
    type = type[0] + type.substr(1);
    const extend = actions instanceof Object ? actions : {};
    const baseActions =
      exclusive === true ?
      {} :
      {
        ...{
          /**
           * Get the index page config for the given type
           * @param {Object} context
           * @param {Object} params
           * @param {boolean} force
           * @returns {Promise}
           */
          getIndexConfig(context: any, params: any = {}, force: boolean = false) {
            const forceGet = force || true;
            return new Promise((resolve, reject) => {
              if (!context.state.config.index || forceGet) {
                log.info(`[Store: ${type}]: GetIndexConfig`);
                return api.getIndexConfig(params).then((response: any) => {
                  context.commit(
                    coreTypes.STORE_GET_INDEX_CONFIG,
                    response.data.data
                  );
                  resolve(context.state.config.index);
                });
              } else {
                log.info(
                  `[Store: ${type}]: Getting existing index config`,
                  params
                );
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
          getFormConfig(context: any, params: any = {}, force: boolean = false) {
            const forceGet = force || true;
            return new Promise((resolve, reject) => {
              if (!context.state.config.form || forceGet) {
                log.info(`[Store: ${type}]: GetFormConfig`);
                return api.getFormConfig(params).then((response: any) => {
                  context.commit(
                    coreTypes.STORE_GET_FORM_CONFIG,
                    response.data.data
                  );
                  resolve(context.state.config.form);
                });
              } else {
                log.info(
                  `[Store: ${type}]: Getting existing form config`,
                  params
                );
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
          setAppendsData(context: any, params: any = {}) {
            log.info(`[Store: ${type}]: Set Appends Data ${type}`, params);
            return Promise.resolve(
              context.commit(coreTypes.STORE_SET_APPENDS_DATA, params)
            );
          },
          /**
           * Get all of the items
           * @param {Object} context
           * @param {Object} params
           * @returns {Promise}
           */
          getAll(context: any, params: any = {}) {
            log.info(`[Store: ${type}]: Get ${type}`, params);
            return new Promise((resolve, reject) => {
              return api
                .getAll(params)
                .then((response: any) => {
                  log.info(
                    `[Store: ${type}]: Got all ${type}`,
                    response.data
                  );
                  context.commit(coreTypes.STORE_GET_ALL, {
                    params,
                    result: response.data,
                  });
                  resolve(context.getters.data);
                })
                .catch((error: any) => {
                  log.info(`[Store: ${type}]: Error getting all`, error);
                  reject(error);
                });
            });
          },
          /**
           * Set the data for the given type
           * @param {Object} context
           * @param {any} data
           */
          setAll(context: any, data: any = {}) {
            log.info(`[Store: ${type}]: Set data ${type}`, data);
            return new Promise((resolve, reject) => {
              context.commit(coreTypes.STORE_SET_ALL, {
                type,
                context,
                data,
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
          getOne(context: any, id: any = {}) {
            log.info(`[Store: ${type}]: Get ${type}`, id);
            return new Promise((resolve, reject) => {
              log.info(`[Store: ${type}]: Getting ${type}`, id);
              if (id) {
                return api
                  .getOne(id)
                  .then((response: any) => {
                    context.commit(coreTypes.STORE_GET, {
                      params: id,
                      result: response.data.data,
                    });
                    resolve(response.data.data);
                  })
                  .catch((error: any) => {
                    reject(error);
                  });
              } else {
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
          setOne(context: any, data: any = {}) {
            log.info(`[Store: ${type}]: Set one ${type}`, data);
            return new Promise((resolve, reject) => {
              context.commit(coreTypes.STORE_SET, {
                type,
                context,
                data,
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
          getOneCached(context: any, id: any): any {
            log.info(`[Store: ${type}]: GetOneCached`, id);
            return new Promise((resolve, reject) => {
              if (utils.findItemInState(context.state, id) === -1) {
                return this.getOneCached(context, id);
              } else {
                log.info(`[Store: ${type}]: Getting existing ${type}`, id);
                resolve(utils.getItemInState(context.state, id));
              }
            });
          },
          /**
           * Save the given data to the store
           * @param {Object} context
           * @param {Object} params
           * @returns {Promise}
           */
          save(context: any, params: any) {
            log.info(`[Store: ${type}]: Save ${type}`, params);
            return new Promise((resolve, reject) => {
              return api
                .save(params)
                .then((response: any) => {
                  log.info(`[Store: ${type}]: Saved ${type}`, response);
                  const data = response.data;
                  context.commit(coreTypes.STORE_SAVE, {
                    type,
                    context,
                    params,
                    result: data,
                  });
                  resolve(data);
                })
                .catch((error: any) => {
                  log.info(`[Store: ${type}]: Error Saving ${type}`, error);
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
          import(context: any, params: any) {
            log.info(`[Store: ${type}]: Import`, params);
            return new Promise((resolve, reject) => {
              return api
                .import(params)
                .then((response: any) => {
                  log.info(`[Store: ${type}]: Imported`, response);
                  const data = response.data;
                  context.commit(coreTypes.STORE_IMPORT, data);
                  resolve(data);
                })
                .catch((error: any) => {
                  log.info(`[Store: ${type}]: Error Importing`, error);
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
          export (context: any, params: any) {
            log.info(`[Store: ${type}]: Export`, params);
            return new Promise((resolve, reject) => {
              return api
                .export(params)
                .then((response: any) => {
                  log.info(`[Store: ${type}]: Exported`, response);
                  const data = response.data;
                  context.commit(coreTypes.STORE_IMPORT, data);
                  resolve(data);
                })
                .catch((error: any) => {
                  log.info(`[Store: ${type}]: Error Exporting`, error);
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
          delete(context: any, params: any) {
            log.info(`[Store: ${type}]: Delete ${type}`, params);
            return new Promise((resolve, reject) => {
              if (params) {
                return api
                  .delete(params)
                  .then((response: any) => {
                    log.info(
                      `[Store: ${type}]: Deleted ${type}`,
                      response.data.data
                    );
                    context.commit(coreTypes.STORE_DELETE, {
                      type,
                      context,
                      params: params,
                      result: response.data.data,
                    });
                    resolve(response.data.data);
                  })
                  .catch((error: any) => {
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
          toggle(context: any, params: any, attr: string) {
            log.info(`[Store: ${type}]: Toggle ${type}`, params);
            return new Promise((resolve, reject) => {
              return api
                .toggle(params)
                .then((response: any) => {
                  log.info(`[Store: ${type}]: Toggled ${type}`, response);
                  const data = response.data.data;
                  context.commit(coreTypes.STORE_SAVE, {
                    type,
                    context,
                    params,
                    result: data,
                  });
                  resolve(data);
                })
                .catch((error: any) => {
                  log.info(
                    `[Store: ${type}]: Error Toggling ${type}`,
                    error
                  );
                  reject(error);
                });
            });
          },
        },
      };

    return {
      ...{
        type() {
          return type;
        },
        log() {
          return log;
        },
      },
      ...baseActions,
      ...extend,
    };
  }

  /**
   * Generate the mutations for the store
   *
   * @param {Object} mutations
   * @param {Object} state
   * @returns
   */
  mutations(mutations: any, types: any, state: any) {
    const extend = mutations instanceof Object ? mutations : {};
    const _TYPES = this.types(types);
    const log = this.log();

    return {
      ...{
        log() {
          return log;
        },
      },
      ...{
        [_TYPES.STORE_UPDATE_STATS](state: any, stats: any) {
          return stats;
        },
        [_TYPES.STORE_GET_FORM_CONFIG](state: any, config: any) {
          state.config.form = config;
        },
        [_TYPES.STORE_GET_INDEX_CONFIG](state: any, config: any) {
          state.config.index = config;
        },
        [_TYPES.STORE_GET](state: any, data: any) {
          utils.addToStateData(state, data.result);
          return data;
        },
        [_TYPES.STORE_SET](state: any, data: any) {
          utils.addToStateData(state, data.result);
          return data;
        },
        [_TYPES.STORE_SAVE](state: any, data: any) {
          // Only update if this is a new item
          utils.addToStateData(state, data.result);
          return data;
        },
        [_TYPES.STORE_IMPORT](state: any, data: any) {
          state.imported = data;
          if (data.data instanceof Array) {
            state.data.data.push([...data.data]);
            state.all = state.all.concat(data.data);
          }
          return data;
        },
        [_TYPES.STORE_EXPORT](state: any, data: any) {
          state.exported = data;
          return data;
        },
        [_TYPES.STORE_CREATE](state: any, data: any) {
          utils.addToStateData(state, data.result);
          return data;
        },
        [_TYPES.STORE_UPDATE](state: any, data: any) {
          utils.updateStateData(state, data.result);
          return data;
        },
        [_TYPES.STORE_SET_APPENDS_DATA](state: any, data: any) {
          state.appendData = !!data;
        },
        [_TYPES.STORE_GET_ALL](state: any, data: any) {
          if (state.appendData) {
            state.data = {
              ...data.result,
              data: {
                data: state.data.data.concat(data.result.data),
              },
            };
          } else {
            state.data = data.result;
          }
          //   state.all = state.all.concat(data.result.data);
          return data;
        },
        [_TYPES.STORE_SET_ALL](state: any, data: any) {
          state.data = data;
          state.all = state.all.concat(data);
          return data;
        },
        [_TYPES.STORE_DELETE](state: any, data: any) {
          utils.removeFromStateData(state, data.params);
        },
        [_TYPES.STORE_CREATE_CACHE_GET](state: any, options: any) {
          return state.cachedCreateStore;
        },
        [_TYPES.STORE_CREATE_CACHE_UPDATE](state: any, data: any, type: string) {
          state.cachedCreateStore = Object.assign(
            state.cachedCreateStore || {},
            data
          );
          let realWindow:any = typeof window !== 'undefined' ? window : null;
          if (realWindow && realWindow instanceof Object) {
            realWindow.localStorage.setItem(
              `cachedCreate${type}`,
              JSON.stringify(state.cachedCreateStore)
            );
          }
        },
        [_TYPES.STORE_CREATE_CACHE_REMOVE](state: any, type: string) {
          state.cachedCreateStore = null;
          let realWindow:any = typeof window !== 'undefined' ? window : null;
          if (realWindow && realWindow instanceof Object) {
            realWindow.localStorage.removeItem(`cachedCreate${type}`);
          }
        },
      },
      ...extend,
    };
  }
}

export default Store;