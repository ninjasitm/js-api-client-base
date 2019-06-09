import defaultLogger from '../logger';

class BaseStore {
    constructor(_props) {
        const props = _props instanceof Object ? _props : {};
        // Instantiate the logger
        this.$log = defaultLogger.create();
        this.allTypes = {};
        this.setApp(props.app);
        this.setApi(props.api);
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
     * @param {Object} logger {
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