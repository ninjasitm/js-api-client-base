var assert = require('chai').assert;
import {
    BaseApi,
    BaseStore
} from '../src';

describe('Service', function () {
    describe('type', function () {
        it('should be [unknown] by default', function () {
            const service = new BaseApi();
            assert.equal(service.type, 'unknown');
        });
    });
    describe('basePath', function () {
        const basePath = 'https://app.local';
        const service = new BaseApi({
            basePath
        });
        it(`should be set properly to ${basePath}`, function () {
            assert.equal(service.basePath, basePath);
        });
        it(`should return proper index url`, function () {
            const url = service.getUrl('save');
            assert.equal(basePath + '/save', url);
        });
        it(`should properly map urls`, function () {
            // Let's use a path object to map paths
            service.path = {
                save: 'create'
            };
            const url = service.getUrl('save');
            assert.equal(basePath + '/create', url);
        });
        it(`should be able to dynamically set the base url`, function () {
            // Let's use a path object to map paths
            service.path = {
                save: 'create'
            };
            const basePath = 'https://app.remote';
            const url = service.getUrl('save', null, {}, basePath);
            assert.equal(basePath + '/create', url);
        });
    });
    describe('logger', function () {
        const service = new BaseApi();
        it('should be set to an object', function () {
            assert.typeOf(service.$log, 'object');
        });
        ['warn', 'log', 'trace', 'info', 'debug', 'error'].map(method => {
            it(`${method} should be a function`, function () {
                assert.typeOf(service.$log[method], 'function');
            });
        });
    });
    describe('api methods', function () {
        it('axios should be the default api', function () {
            assert.typeOf(service.$api, 'function');
        });
        const service = new BaseApi();
        [
            'getIndexConfig',
            'getFormConfig',
            'getAll',
            'getOne',
            'save',
            'import',
            'toggle',
            'import'
        ].map(method => {
            it(`${method} should be a function`, function () {
                assert.typeOf(service[method], 'function');
            });
        });
    });
});

describe('Store', function () {
    describe('modules', function () {
        it('should contain a vuex store', function () {
            assert.typeOf(BaseStore.vuexStore, 'object');
            describe('vuex store', function () {
                describe('logger', function () {
                    const store = BaseStore.vuexStore;
                    it('should be set to an object', function () {
                        assert.typeOf(store.$log, 'object');
                    });
                    ['warn', 'log', 'trace', 'info', 'debug', 'error'].map(method => {
                        it(`${method} should be a function`, function () {
                            assert.typeOf(store.$log[method], 'function');
                        });
                    });
                    it('should be able to set the logger', function () {
                        store.setLogger(null);
                        assert.typeOf(store.$log, 'null');
                    });
                    it('should be able to create the logger using the default logger', function () {
                        store.createLogger('WARN');
                        assert.typeOf(store.$log, 'object');
                    });
                });
                describe('state', function () {
                    const store = BaseStore.vuexStore;
                    const state = store.state();
                    it('should be set to a default object', function () {
                        assert.typeOf(state, 'object');
                    });
                    const properties = {
                        config: 'object',
                        status: 'object',
                        data: 'object',
                        all: 'array',
                        imported: 'object'
                    };
                    Object.keys(properties).map(property => {
                        it(`${property} should be an ${properties[property]}`, function () {
                            assert.typeOf(state[property], properties[property]);
                        });
                    });
                    it('should be possible to exclusively set the state', function () {
                        const state = store.state(null, true);
                        assert.typeOf(state, 'object');
                        assert.deepEqual(state, {});
                    });
                    it('should be possible to extend the state', function () {
                        const state = store.state({
                            extra: {}
                        }, true);
                        assert.typeOf(state, 'object');
                        assert.deepEqual(state, {
                            ...state,
                            ...{
                                extra: {}
                            }
                        });
                    });
                });
                describe('getters', function () {
                    const store = BaseStore.vuexStore;
                    const getters = store.getters();
                    const state = store.state();
                    it('should be set to a default object', function () {
                        assert.typeOf(getters, 'object');
                    });
                    it('should have a logger', function () {
                        assert.typeOf(getters.$log, 'object');
                    });
                    const properties = {
                        config: 'object',
                        indexConfig: 'null',
                        formConfig: 'null',
                        data: 'object',
                        isAllLoaded: 'boolean',
                        imported: 'object'
                    };
                    Object.keys(properties).map(property => {
                        it(`${property} should be an ${properties[property]}`, function () {
                            assert.typeOf(getters[property](state), properties[property]);
                        });
                    });
                    it('should be possible to exclusively set the getters', function () {
                        const getters = store.getters(null, true);
                        assert.typeOf(getters, 'object');
                        assert.deepEqual(getters, {
                            $log: getters.$log,
                        });
                    });
                    it('should be possible to extend the getters', function () {
                        const getters = store.getters({
                            extra: {},
                        }, true);
                        assert.typeOf(getters, 'object');
                        assert.deepEqual(getters, {
                            $log: getters.$log,
                            extra: {}
                        });
                    });
                });
                describe('actions', function () {
                    const store = BaseStore.vuexStore;
                    const actions = store.actions();
                    const state = store.state();
                    it('should be set to a default object', function () {
                        assert.typeOf(actions, 'object');
                    });
                    it('should have a default type of unknown', function () {
                        assert.typeOf(actions, 'object');
                    });
                    it('should have a logger', function () {
                        assert.typeOf(actions.$log, 'object');
                    });
                    [
                        'getIndexConfig',
                        'getFormConfig',
                        'getAll',
                        'getOne',
                        'save',
                        'import',
                        'toggle',
                        'import'
                    ].map(method => {
                        it(`${method} should be a function`, function () {
                            assert.typeOf(actions[method], 'function');
                        });
                    });
                    it('should be possible to extend the actions', function () {
                        const actions = store.actions({
                            extra: {},
                        }, 'custom', {});
                        assert.typeOf(actions, 'object');
                        assert.equal(actions.type, 'custom');
                        assert.deepInclude(actions, {
                            extra: {}
                        });
                    });
                });
                describe('mutations', function () {
                    const store = BaseStore.vuexStore;
                    const mutations = store.mutations();
                    const state = store.state();
                    it('should be set to a default object', function () {
                        assert.typeOf(mutations, 'object');
                    });
                    it('should have a default type of unknown', function () {
                        assert.typeOf(mutations, 'object');
                    });
                    it('should have a logger', function () {
                        assert.typeOf(mutations.$log, 'object');
                    });
                    Object.values(mutations._TYPES).map(method => {
                        it(`${method} should be a function`, function () {
                            assert.typeOf(mutations[method], 'function');
                        });
                    });
                    it('should be possible to extend the mutations', function () {
                        const mutations = store.mutations({
                            CUSTOM_MUTATION0: () => {},
                            CUSTOM_MUTATION1: () => {},
                        }, {}, state);
                        assert.typeOf(mutations, 'object');
                        assert.property(mutations, 'CUSTOM_MUTATION0');
                        assert.property(mutations, 'CUSTOM_MUTATION1');
                        assert.typeOf(mutations.CUSTOM_MUTATION1, 'function');
                        assert.typeOf(mutations.CUSTOM_MUTATION1, 'function');
                    });
                    const commitable = {
                        [mutations._TYPES.STORE_GET_FORM_CONFIG]: {},
                        [mutations._TYPES.STORE_GET_INDEX_CONFIG]: {},
                        [mutations._TYPES.STORE_GET]: {
                            result: {}
                        },
                        [mutations._TYPES.STORE_SET]: {
                            result: {}
                        },
                        [mutations._TYPES.STORE_SAVE]: {
                            result: {}
                        },
                        [mutations._TYPES.STORE_IMPORT]: {
                            data: []
                        },
                        [mutations._TYPES.STORE_CREATE]: {
                            result: {}
                        },
                        [mutations._TYPES.STORE_UPDATE]: {
                            result: {}
                        },
                        [mutations._TYPES.STORE_GET_ALL]: {
                            result: {
                                data: []
                            }
                        },
                        [mutations._TYPES.STORE_DELETE]: {
                            params: {}
                        },
                        [mutations._TYPES.STORE_SET_ALL]: [],
                        [mutations._TYPES.STORE_CREATE_CACHE_GET]: {},
                        [mutations._TYPES.STORE_CREATE_CACHE_UPDATE]: {},
                        [mutations._TYPES.STORE_CREATE_CACHE_REMOVE]: {},
                    };
                    Object.keys(commitable).map(mutation => {
                        it(`should be possible to commit mutation ${mutation}`, function () {
                            assert.doesNotThrow(() => mutations[mutation](state, commitable[mutation]), Error);
                        });
                    });
                });
            });
        });
    });
});