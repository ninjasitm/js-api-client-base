import { IApi } from "../types";
/**
 * This class provides some core functionality that other modules can extend from
 *
 * @class BaseApi
 */
declare class BaseApi implements IApi {
    $log: any;
    $app: any;
    $api: any;
    allTypes: any;
    type: string;
    path: any;
    basePath: string;
    proxy: ProxyConstructor;
    proxyHandler: any;
    utils: any;
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
    constructor(props?: any);
    /**
     * Get the app object
     * @returns {Object}
     */
    app(): any;
    /**
     * Get the app object
     * @returns {Object}
     */
    api(): any;
    /**
     * Get the log object
     * @returns {Object}
     */
    log(): any;
    /**
     * Set the API to use
     * By default will use axios
     * @param {Object} api
     */
    setApi(api: any, headers?: any): void;
    /**
     * Set the app
     * @param {Object} app
     */
    setApp(app: any): void;
    /**
     * Set the logger to use
     * By default will use js-logger
     * @param {Object} logger
     */
    setLogger(logger: any, level: string): void;
    /**
     * get the base path
     * @param {string} action
     * @param {Object} app
     * @param {Object} params
     */
    getBasePath(action: string, app: any, params: any): string;
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
    createProxy(): typeof Proxy;
    /**
     * Build an API getter
     *
     * @param {string} index
     * @param {string} _endPoint
     * @param {Object|int} params
     * @returns
     * @memberof BaseApi
     */
    getUrl(index: string, _endPoint?: null, _params?: null, basePath?: null, app?: null): string;
    /**
     * Get the index configurataion for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    getIndexConfig(params: any, options: any): any;
    /**
     * Get the form configuration for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    getFormConfig(params: any, options: any): any;
    /**
     * Get all items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    getAll(params: any, options: any): any;
    /**
     * Get a single item
     *
     * @param {*} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    getOne(params: any, options: any): any;
    /**
     * Save an item
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    save(params: any, options: any): any;
    /**
     * Import many items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    import(params: any, options: any): any;
    /**
     * Export many items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    export(params: any, options: any): any;
    /**
     * Delete an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    delete(params: any, options: any): any;
    /**
     * Toggle an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    toggle(params: any, options: any): any;
    /**
     * Duplicate an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    duplicate(params: any, options: any): any;
}
export default BaseApi;
