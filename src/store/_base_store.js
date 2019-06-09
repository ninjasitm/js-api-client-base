import defaultLogger from '../logger';

class BaseStore {
    constructor(_props) {
        this.init(_props);
        // Instantiate the logger
        this.$log = this.$log || defaultLogger.create();
    }

    init(_props) {
        const props = _props instanceof Object ? _props : {};
        this.allTypes = {};
        this.setApp(props.app);
        this.setApi(props.api);
        this.setLogger(props.logger);
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
     * Set the api
     * @param {Object} api
     */
    setApi(api) {
        if (api instanceof Object) {
            this.$api = api;
        }
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
     * @param {Object} logger with the following signature {
     *  log: function,
     *  info: function
     *  warn: function,
     *  error: function
     *  trace: function,
     *  debug: function
     * }
     */
    setLogger(logger) {
        this.$log = logger;
    }

    /**
     * Utility function to create the logger with the desired level
     * @param {string} level
     */
    createLogger(level) {
        this.$log = defaultLogger.create(level);
    }
}

export default BaseStore;