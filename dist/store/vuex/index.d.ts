export default Store;
declare class Store extends BaseStore {
    constructor(_props: any);
    utils: {
        addToStateData(state: any, originalItem: any, stateIsTarget: any, push: any): void;
        updateStateData(state: any, originalItem: any, stateIsTarget: any, addToState: any): void;
        removeFromStateData(state: any, originalItem: any, stateIsTarget: any): void;
        findItemInState(state: any, item: any, stateIsTarget: any): any;
        getItemInState(state: any, item: any, stateIsTarget: any): any;
        resolveError(error: any, reject: any): any;
        flattenObject(data: any, addToKey: string): any;
        createFormData(data: any): any;
        printFormData(formData: any): void;
        objectValues(object: any): any[];
        getCookie(name: string): string | undefined;
    };
    coreTypes: {
        STORE_GET_INDEX_CONFIG: string;
        STORE_GET_FORM_CONFIG: string;
        STORE_GET: string;
        STORE_SET: string;
        STORE_SET_APPENDS_DATA: string;
        STORE_GET_ALL: string;
        STORE_SET_ALL: string;
        STORE_SAVE: string;
        STORE_CREATE: string;
        STORE_UPDATE: string;
        STORE_IMPORT: string;
        STORE_EXPORT: string;
        STORE_DELETE: string;
        STORE_UPDATE_STATS: string;
        STORE_CREATE_CACHE_GET: string;
        STORE_CREATE_CACHE_UPDATE: string;
        STORE_CREATE_CACHE_REMOVE: string;
    };
    /**
     * Generate the modules dynamically
     * @param {Object} modules
     */
    generateModules(modules: Object): {};
    types(types: any): any;
    /**
     * Generate a state object
     *
     * @param {Object} state
     * @param {boolean} exclusive
     * @returns
     */
    state(state: Object, exclusive: boolean): {
        constructor: Function;
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
    getters(getters: any, exclusive: boolean): any;
    /**
     * Generate the actions for the store
     *
     * @param {Object} actions
     * @param {string} type
     * @param {boolean} exclusive
     * @param {Object} api
     * @returns
     */
    actions(actions: Object, _type: any, exclusive: boolean): {
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        type(): any;
        log(): any;
    };
    /**
     * Generate the mutations for the store
     *
     * @param {Object} mutations
     * @param {Object} state
     * @returns
     */
    mutations(mutations: Object, types: any, state: Object): {
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: string | number | symbol): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: string | number | symbol): boolean;
        log(): any;
    };
}
import BaseStore from "../_base_store";
