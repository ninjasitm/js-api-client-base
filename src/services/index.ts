import defaultLogger from "../logger";
import axios from "axios";
import utils from "./utils";
import { IApi } from "../types";

function initDefaultApi(options: any = {}) {
	let api = axios.create({
		...{
			timeout: 1000
		},
		...options
	});
	return api;
}

/**
 * This class provides some core functionality that other modules can extend from
 *
 * @class BaseApi
 */
class BaseApi implements IApi {
	$log: any;
	$app: any = {};
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
	constructor(props: any = {}) {
		this.type = props.type || "unknown";
		this.path = props.path;
		this.basePath = props.basePath;
		this.proxy = this.createProxy();
		this.$log = props.log;
		this.$api = props.api;
		this.$app = props.app;
		this.utils = utils;
		this.setLogger(props.logger, props.level);
		this.setApi(props.api);
		this.setApp(props.app);
	}

	/**
	 * Get the app object
	 * @returns {Object}
	 */
	app() {
		return this.$app;
	}

	/**
	 * Get the app object
	 * @returns {Object}
	 */
	api() {
		return this.$api;
	}

	/**
	 * Get the log object
	 * @returns {Object}
	 */
	log() {
		return this.$log;
	}

	/**
	 * Set the API to use
	 * By default will use axios
	 * @param {Object} api
	 */
	setApi(api: any, headers: any = {}) {
		this.$api =
			api ||
			initDefaultApi({
				baseURL: this.basePath,
				headers: headers
			});
	}

	/**
	 * Set the app
	 * @param {Object} app
	 */
	setApp(app: any) {
		if (app instanceof Object) {
			this.$app = app;
		}
	}

	/**
	 * Set the logger to use
	 * By default will use js-logger
	 * @param {Object} logger
	 */
	setLogger(logger: any, level: string) {
		this.$log = logger || defaultLogger.create(level);
	}

	/**
	 * get the base path
	 * @param {string} action
	 * @param {Object} app
	 * @param {Object} params
	 */
	getBasePath(action: string, app: any, params: any) {
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
	createProxy(): typeof Proxy {
		const instance = this;
		return new Proxy({}, {
			get(target: any, propKey: string) {
				const property = propKey ? (propKey as string).toLowerCase() : "get";
				const method = instance.api().hasOwnProperty(property) ? property : null;

				if (!method) return;

				const path =
					instance.getUrl(propKey) +
					"/"
						.substring(method.length)
						.replace(/([a-z])([A-Z])/g, "$1/$2")
						.replace(/\$/g, "/$/")
						.toLowerCase();
				return (...args: any[]) => {
					const finalPath = path.replace(/\$/g, () => args.shift());
					const body = args.shift() || {};
					const params = args.shift() || body;
					if (["post", "put", "patch"].indexOf(method) !== -1) {
						return instance.api()[property](finalPath, body, {
							params
						});
					} else {
						return instance.api()[property](finalPath, {
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
	getUrl(index: string, _endPoint = null, _params = null, basePath = null, app = null) {
		const params = (_params || {} as any).data || (_params || {});
		let paths: Array<any> = basePath ? [basePath] : [this.getBasePath(index, app || this.$app, params)];
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
			paths.push(this.path, endPoint);
		}
		return paths.filter(value => !!value).join("/");
	}

	/**
	 * Get the index configurataion for a type
	 *
	 * @returns {Promise}
	 * @param {Object} options
	 * @memberof BaseApi
	 */
	getIndexConfig(params: any, options: any) {
		const id = params instanceof Object ? params.id : params;
		this.log().info(`[Services: ${this.type}]: GetIndexConfig`);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.get(
				`${this.getUrl(
					getter || "getIndexConfig",
					endPoint || "index-config",
					params
				)}${id ? "/" + id : ""}`
			)
			.catch((error: any) => {
				this.log().warn(`[Services: ${this.type}: GetIndexConfig]:`, error);
				throw this.utils.resolveError(error);
			});
	}

	/**
	 * Get the form configuration for a type
	 *
	 * @returns {Promise}
	 * @param {Object} options
	 * @memberof BaseApi
	 */
	getFormConfig(params: any, options: any) {
		const id = params instanceof Object ? params.id : params;
		this.log().info(`[Services: ${this.type}]: GetFormConfig`);
		const {
			getter,
			endPoint
		} = options || {};
		const idPart = id ? "/" + id : "";
		return this.api()
			.get(
				`${this.getUrl(
					getter || "getFormConfig",
					endPoint || "form-config",
					params
				)}${idPart}`
			)
			.catch((error: any) => {
				this.log().warn(`[Services: ${this.type}: GetFormConfig]:`, error);
				throw this.utils.resolveError(error);
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
	getAll(params: any, options: any) {
		this.log().info(`[Services: ${this.type}]: Get All ${this.type}`, params);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.get(this.getUrl(getter || "getAll", endPoint || null, params), {
				params: params
			})
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Get All ${this.type}]:`,
					error
				);
				throw this.utils.resolveError(error);
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
	getOne(params: any, options: any) {
		const id = params instanceof Object ? params.id : params;
		this.log().info(`[Services: ${this.type}]: Get ${this.type}`, id);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.get(
				this.getUrl(getter || "getOne", endPoint || null, params) + "/" + id, {
				params
			}
			)
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Get ${this.type}]: Error`,
					error
				);
				throw this.utils.resolveError(error);
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
	save(params: any, options: any) {
		const id = params.id;
		const data = this.utils.createFormData(params);
		this.log().info(
			`[Services: ${this.type}]: Save ${this.type}`,
			params,
			data,
			id
		);
		const method = id ? `post` : `post`;
		const {
			getter,
			endPoint
		} = options || {};
		const idPart = id ? "/" + id : "";
		return this.api()[method](
			`${this.getUrl(
				getter || "save",
				endPoint || null,
				params.data || params
			)}${idPart}`,
			data
		)
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Save ${this.type}]: Error`,
					error.response
				);
				throw this.utils.resolveError(error);
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
	import(params: any, options: any) {
		const data = this.utils.createFormData(params);
		this.log().info(`[Services: ${this.type}]: Import ${this.type}`, data);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.post(this.getUrl(getter || "import", endPoint || "import", params), data)
			.catch((error: any) => {
				this.log().warn(`[Services: ${this.type}: Import]: Error`, error);
				throw this.utils.resolveError(error);
			});
	}

	/**
	 * Export many items
	 *
	 * @param {Object} params
	 * @param {Object} options
	 * @returns {Promise}
	 * @memberof BaseApi
	 */
	export(params: any, options: any) {
		const data = this.utils.createFormData(params);
		this.log().info(`[Services: ${this.type}]: Export ${this.type}`, data);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.post(this.getUrl(getter || "export", endPoint || "export", params), data)
			.catch((error: any) => {
				this.log().warn(`[Services: ${this.type}: Export]: Error`, error);
				throw this.utils.resolveError(error);
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
	delete(params: any, options: any) {
		const id = params.id || params;
		const urlParams = params.params || {};
		const bodyParams = params.body || {};
		const dataParams = params.data || {};
		this.log().info(`[Services: ${this.type}]: Delete ${this.type}`, id);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.delete(
				this.getUrl(getter || "delete", endPoint || null, params) + "/" + id, {
				params: urlParams,
				body: bodyParams,
				data: dataParams
			}
			)
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Delete ${this.type}]: Error`,
					error
				);
				throw this.utils.resolveError(error);
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
	toggle(params: any, options: any) {
		const id = params.id || params;
		this.log().info(`[Services: ${this.type}]: Toggle ${this.type}`, id);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.put(
				this.getUrl(getter || "toggle", endPoint || "toggle", params) + "/" + id
			)
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Toggle ${this.type}]: Error`,
					error
				);
				throw this.utils.resolveError(error);
			});
	}

	/**
	 * Duplicate an item
	 *
	 * @param {any} params
	 * @param {Object} options
	 * @returns {Promise}
	 * @memberof BaseApi
	 */
	duplicate(params: any, options: any) {
		this.log().info(`[Services: ${this.type}]: Duplicate ${this.type}`, params);
		const {
			getter,
			endPoint
		} = options || {};
		return this.api()
			.post(
				this.getUrl(getter || "duplicate", endPoint || "duplicate", params),
				params
			)
			.catch((error: any) => {
				this.log().warn(
					`[Services: ${this.type}: Duplicate ${this.type}]: Error`,
					error
				);
				throw this.utils.resolveError(error);
			});
	}
}

export default BaseApi;