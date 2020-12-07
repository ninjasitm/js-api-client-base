import BaseStore from "../_base_store";
import { IStore } from "../../types";
declare class Store extends BaseStore implements IStore {
    coreTypes: object;
    utils: any;
    constructor(props?: any);
    /**
     * Generate the modules dynamically
     * @param {Object} modules
     */
    generateModules(modules: any): any;
    types(types: object): any;
    /**
     * Generate a state object
     *
     * @param {Object} state
     * @param {boolean} exclusive
     * @returns
     */
    state(state: object, exclusive?: boolean): {
        constructor: Function;
        /**
         * Get the index page config for the given type
         * @param {Object} context
         * @param {Object} params
         * @param {boolean} force
         * @returns {Promise}
         */
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        config?: undefined;
        status?: undefined;
        appendData?: undefined;
        data?: undefined;
        all?: undefined;
        imported?: undefined;
        exported?: undefined;
    } | {
        constructor: Function;
        /**
         * Get the index page config for the given type
         * @param {Object} context
         * @param {Object} params
         * @param {boolean} force
         * @returns {Promise}
         */
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        config: {
            index: null;
            form: null;
        };
        status: {
            data: string;
        };
        appendData: boolean;
        data: {
            data: never[];
        };
        all: never[];
        imported: {
            data: never[];
        };
        exported: {
            data: never[];
        };
    };
    /**
     * Generate the getters for the store
     * @aram {Object}
     * @param {boolean} exclusive
     * @returns
     */
    getters(getters: object, exclusive?: boolean): {
        constructor: Function;
        /**
         * Get the index page config for the given type
         * @param {Object} context
         * @param {Object} params
         * @param {boolean} force
         * @returns {Promise}
         */
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        config?: undefined;
        indexConfig?: undefined;
        formConfig?: undefined;
        data?: undefined;
        isAllLoaded?: undefined;
        imported?: undefined;
        log(): any;
    } | {
        constructor: Function;
        /**
         * Get the index page config for the given type
         * @param {Object} context
         * @param {Object} params
         * @param {boolean} force
         * @returns {Promise}
         */
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        config: (state: any) => any;
        indexConfig: (state: any) => any;
        formConfig: (state: any) => any;
        data: (state: any) => any;
        isAllLoaded: (state: any) => boolean;
        imported: (state: any) => any;
        log(): any;
    };
    /**
     * Generate the actions for the store
     *
     * @param {Object} actions
     * @param {string} type
     * @param {boolean} exclusive
     * @param {Object} api
     * @returns
     */
    actions(actions: object, _type?: string, exclusive?: boolean): {
        constructor: Function;
        /**
         * Get the index page config for the given type
         * @param {Object} context
         * @param {Object} params
         * @param {boolean} force
         * @returns {Promise}
         */
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        type(): string;
        log(): any;
    };
    /**
     * Generate the mutations for the store
     *
     * @param {Object} mutations
     * @param {Object} state
     * @returns
     */
    mutations(mutations: any, types: any, state: any): any;
}
export default Store;
