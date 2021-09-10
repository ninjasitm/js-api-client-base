import defaultLogger from "../logger";
import { IApi, IStoreOptions, IJsApi, IStore } from "../types";

class Store implements IStore {
	$log: any;
	$app: any;
	$api: any;
	allTypes: any;

	constructor(props: IStoreOptions) {
		this.init(props);
		// Instantiate the logger
		this.$log = this.$log || defaultLogger.create();
	}

	init(props: IStoreOptions) {
		this.allTypes = {};
		this.setApp(props.app);
		this.setApi(props.api);
		this.setLogger(props.logger);
	}

	/**
	 * Get the app object
	 * @returns {Object}
	 */
	app() {
		return this.$app;
	}

	/**
	 * Get the api object
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
	 * Set the api
	 * @param {Object} api
	 */
	setApi(api: IApi) {
		if (api instanceof Object) {
			try {
				api.setApp(this.$app);
				api.setApi(this.$app.$http);
			} catch (error) {
				this.log().warn("Missing setApp method", this.$api);
				api.$app = this.$app;
				const $app = this.$app;
				api.app = function() {
					return $app;
				};
				const $log = this.$log;
				api.log = function() {
					return $log;
				};
			}
			this.$api = api;
		}
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
	 * @param {Object} logger with the following signature {
	 *  log: function,
	 *  info: function
	 *  warn: function,
	 *  error: function
	 *  trace: function,
	 *  debug: function
	 * }
	 */
	setLogger(logger: any) {
		this.$log = logger;
	}

	/**
	 * Utility function to create the logger with the desired level
	 * @param {string} level
	 */
	createLogger(level: string = 'INFO') {
		this.$log = defaultLogger.create(level);
	}
}

export default Store;
