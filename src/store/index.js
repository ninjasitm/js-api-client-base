import defaultLogger from '../logger';
import vuexStoreBase from './vuex';

const loggerSettings = {
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
    },
    // Instantiate the logger
    $log: defaultLogger.create(),
    /**
     * Utility function to create the logger with the desired level
     * @param {string} level 
     */
    createLogger(level) {
        this.$log = defaultLogger.create(level);
    }
};

const vuexStore = {
    ...vuexStoreBase,
    ...loggerSettings
};

export default {
    vuexStore
};