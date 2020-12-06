import { IApi, IStoreOptions, IStore } from "../types";
declare class Store implements IStore {
    $log: any;
    $app: any;
    $api: any;
    allTypes: any;
    constructor(props: IStoreOptions);
    init(props: IStoreOptions): void;
    /**
     * Get the app object
     * @returns {Object}
     */
    app(): any;
    /**
     * Get the api object
     * @returns {Object}
     */
    api(): any;
    /**
     * Get the log object
     * @returns {Object}
     */
    log(): any;
    /**
     * Set the api
     * @param {Object} api
     */
    setApi(api: IApi): void;
    /**
     * Set the app
     * @param {Object} app
     */
    setApp(app: any): void;
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
    setLogger(logger: any): void;
    /**
     * Utility function to create the logger with the desired level
     * @param {string} level
     */
    createLogger(level?: string): void;
}
export default Store;
