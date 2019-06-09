import defaultLogger from '../logger';
import axios from 'axios';
import utils from './utils';

function initDefaultApi(options) {
    const allOptions = options || {};
    let api = axios.create({
        ...{
            timeout: 1000
        },
        ...allOptions
    });
    return api;
}

/**
 * This class provides some core functionality that other modules can extend from
 *
 * @class BaseApi
 */
class BaseApi {
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
    constructor(_props) {
        const props = _props || {};
        this.type = props.type || 'unknown';
        this.path = props.path;
        this.basePath = props.basePath;
        this.proxy = this.createProxy();
        this.$log = null;
        this.$api = null;
        this.setLogger(props.logger, props.level);
        this.setApi(props.api);
    }

    /**
     * Get the app object
     * @returns {Object}
     */
    $api() {
        return this.$api;
    }

    /**
     * Get the log object
     * @returns {Object}
     */
    $log() {
        return this.$log;
    }

    /**
     * Set the API to use
     * By default will use axios
     * @param {Object} api
     */
    setApi(api, headers) {
        this.$api = api || initDefaultApi({
            baseURL: this.basePath,
            headers: headers || {}
        });
    }

    /**
     * Set the app
     * @param {Object} app
     */
    setApp(app) {
        if (app instanceof Object) {
            this.$app = app;
        }
    }

    /**
     * Set the logger to use
     * By default will use js-logger
     * @param {Object} logger
     */
    setLogger(logger, level) {
        this.$log = logger || defaultLogger.create(level);
    }

    /**
     * get the base path
     * @param {string} action
     * @param {Object} app
     * @param {Object} params
     */
    getBasePath(action, app, params) {
        return this.basePath;
    }

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
    createProxy() {
        const instance = this;
        return new Proxy({}, {
            get(target, propKey) {
                const property = propKey ?
                    propKey.toLowerCase() :
                    'get';
                const method = this
                    .api()
                    .hasOwnProperty(property) ?
                    property :
                    null;

                if (!method)
                    return;

                const path = instance.getUrl(propKey) + '/'
                    .substring(method.length)
                    .replace(/([a-z])([A-Z])/g, '$1/$2')
                    .replace(/\$/g, '/$/')
                    .toLowerCase();
                return (...args) => {
                    const finalPath = path.replace(/\$/g, () => args.shift());
                    const body = args.shift() || {};
                    const params = args.shift() || body;
                    if (['post', 'put', 'patch'].indexOf(method) !== -1) {
                        return this.api()[property](finalPath, body, {
                            params
                        });
                    } else {
                        return this.api()[property](finalPath, {
                            params
                        });
                    }
                };
            }
        });
    }

    /**
     * Build an API getter
     *
     * @param {string} index
     * @param {string} _endPoint
     * @param {Object|int} params
     * @returns
     * @memberof BaseApi
     */
    getUrl(index, _endPoint, params, basePath, app) {
        let paths = basePath ? [basePath] : [this.getBasePath(index, app, params)];
        const endPoint = _endPoint || null;
        if (this.path instanceof Object) {
            if (this.path.hasOwnProperty(index)) {
                const getter = this.path[index];
                if (getter instanceof Function) {
                    const value = getter(app, params);
                    paths.push(value);
                } else {
                    paths.push(this.path.default, getter);
                }
            } else {
                paths.push(this.path.default, endPoint);
            }
        } else {
            paths.push(this.path, endPoint || index);
        }
        return paths
            .filter(value => !!value)
            .join('/');
    }

    /**
     * Get the index configurataion for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    getIndexConfig(params, options) {
        const id = params instanceof Object ?
            params.id :
            params;
        this.$log.info(`[Services: ${this.type}]: GetIndexConfig`);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .get(`${this.getUrl(getter || 'getIndexConfig', endPoint || 'index-config', params)}${id ? '/' + i : ''}`)
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: GetIndexConfig]:`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Get the form configuration for a type
     *
     * @returns {Promise}
     * @param {Object} options
     * @memberof BaseApi
     */
    getFormConfig(params, options) {
        const id = params instanceof Object ?
            params.id :
            params;
        this.$log.info(`[Services: ${this.type}]: GetFormConfig`);
        const {
            getter,
            endPoint
        } = options || {};
        const idPart = id ? '/' + id : '';
        return this
            .api()
            .get(`${this.getUrl(getter || 'getFormConfig', endPoint || 'form-config', params)}${idPart}`)
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: GetFormConfig]:`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Get all items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    getAll(params, options) {
        this.$log.info(`[Services: ${this.type}]: Get All ${this.type}`, params);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .get(this.getUrl(getter || 'getAll', endPoint || null, params), {
                params: params
            })
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: Get All ${this.type}]:`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Get a single item
     *
     * @param {*} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    getOne(params, options) {
        const id = params instanceof Object ?
            params.id :
            params;
        this.$log.info(`[Services: ${this.type}]: Get ${this.type}`, id);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .get(this.getUrl(getter || 'getOne', endPoint || null, params) + '/' + id, {
                params
            })
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: Get ${this.type}]: Error`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Save an item
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    save(params, options) {
        const id = params.id;
        const data = utils.createFormData(params);
        this.$log.info(`[Services: ${this.type}]: Save ${this.type}`, params, data, id);
        const method = id ?
            `post` :
            `post`;
        const {
            getter,
            endPoint
        } = options || {};
        const idPart = id ? '/' + id : '';
        return this.api()[method](`${this.getUrl(getter || 'save', endPoint || null, data)}${idPart}`, data).catch((error) => {
            this.$log.error(`[Services: ${this.type}: Save ${this.type}]: Error`, error.response);
            throw utils.resolveError(error);
        });
    }

    /**
     * Import many items
     *
     * @param {Object} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    import(params, options) {
        const data = utils.createFormData(params);
        this.$log.info(`[Services: ${this.type}]: Import ${this.type}`, data);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .post(this.getUrl(getter || 'import', endPoint || 'import', data), data)
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: Import]: Error`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Delete an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    delete(params, options) {
        const id = params.id || params;
        this.$log.info(`[Services: ${this.type}]: Delete ${this.type}`, id);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .delete(this.getUrl(getter || 'delete', endPoint || null, params) + '/' + id)
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: Delete ${this.type}]: Error`, error);
                throw utils.resolveError(error);
            });
    }

    /**
     * Toggle an item
     *
     * @param {any} params
     * @param {Object} options
     * @returns {Promise}
     * @memberof BaseApi
     */
    toggle(params, options) {
        const id = params.id || params;
        this.$log.info(`[Services: ${this.type}]: Toggle ${this.type}`, id);
        const {
            getter,
            endPoint
        } = options || {};
        return this
            .api()
            .put(this.getUrl(getter || 'toggle', endPoint || 'toggle', params) + '/' + id)
            .catch((error) => {
                this.$log.error(`[Services: ${this.type}: Toggle ${this.type}]: Error`, error);
                throw utils.resolveError(error);
            });
    }
}

export default BaseApi;