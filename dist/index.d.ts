import BaseApi from './services';
export { default as BaseApi } from './services';
export { default as BaseStore } from './store';
declare const _default: {
    BaseApi: typeof BaseApi;
    BaseStore: {
        VuexStore: typeof import("./store/vuex").default;
    };
};
export default _default;
