# Js API Client Base

JavaScript API client base. Use this to develop services for react, vue or others using axios

# Installation

`npm install gitlab:nitm/js-api-client-base`

# Usage

## Create the API Service

```
import BaseApi from 'js-api-client-base';

const api = new BaseApi();

// Extend the class
class Api extends BaseApi {
    ... Customization
}

const api = new Api();

// Get a url
const url = api.getUrl('save');
console.log(url);

const url = api.getUrl('save', 'create');
console.log(url);
```

### Configuration

```
const api = new BaseApi({
    basePath: @url,
    path: Object,
    type: string,
    logger: Logging Tool,
    level: Log level,
    api: The underlying Api
});
```

#### Options
 - basePath: {String} The base url for requests
 - path: {String|Object}. Used to map paths
    ```
    {
        path: value,
        default: value
    }
    ```
 - type: {String}
 - logger: {Object}. An object that supports the following methods
    ```
    {
        log: function,
        info: function
        warn: function,
        error: function
        trace: function,
        debug: function
    }
    ```
 - level: {String} One of: [LOG, INFO, WARN, ERROR, TRACE, DEBUG, OFF]
 - api: {Object} An underlying API resource to use. By default we use axios

### Set the logger
By default we will use `js-logger`
```
api.setLogger(object, level);
```

### Set the api resource to use
By default we will use `axios`
```
api.setApi(object, headers);
```

## Create a store
Create a store using one of the underlying store engines.

``` 
// Create a vuex store
const helper = BaseStore.vuexStore;

const types = helper.types('content');
const state = helper.state();
const getters = helper.getters();
const actions = helper.actions({}, 'Content', api);
const mutations = helper.mutations({}, types, state);

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
```

// Each tool can extend the base helper

### Extend the types
```
const types = helper.types([
    'MUTATION1',
    'MUTATION2'
])
```
### Extend the state
```
const state = helper.state({
    custom: {}
}, true);

// This will result in the core state plus your extra state

// Use the exclusive flag to prevent extending the base state

const state = helper.state({
    custom: {}
});
```

### Extend the getters
```
const getters = helper.getters({
    custom: {}
});

// This will result in the core getters plus your extra getters

// Use the exclusive flag to prevent extending the base getters

const getters = helper.getters({
    custom: {}
}, true);
```

### Extend the actions
Each action object contains the `$log` property for using within mutations.
```
const type = 'custom';
const api = fetch;

const actions = helper.actions({
    custom: {}
}, type, api);
```

### Extend the mutations
Each mutation object contains the `$log` property for using within mutations and a `_TYPES` object that contains the mutation types.
```
const mutations = helper.mutations({
    [MUTATION1]: (state, options) => {},
    [MUTATION2]: (state, options) => {}
}, types, state);

// This will result in the core mutations plus your extra mutations
```

### Set the logger
By default we will use `js-logger`
```
store.setLogger(object, level);

// Creates the default logger with the level specified
store.createLogger(level);
```