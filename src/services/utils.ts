export default {
  resolveError(error: any, reject: any) {
    let data = error.response ? error.response.data : error;
    if (data.error) {
      // The request was made, but the server responded with a status code
      data = data.error.message || (data.error.errors ? data.error.errors.message : null) || data.error;
    } else {
      // Something happened in setting up the request that triggered an Error
      data = data.data || data.message || data.exception || data;
    }
    let result = error.response && error.response.data.errors ? Object.assign({}, {
      code: error.response.status
    }, error.response.data) : {
      code: error.response ? error.response.status : error.status,
      message: data
    };
    return result;
  },
  flattenObject(data: any, addToKey: string) {
    addToKey = addToKey || 'filter';
    let result:any = {};

    const flattenObjectLocal = function (object: any, parent: string | number) {
      if (object) {
        for (const k of Object.keys(object)) {
          let fullKey = k;
          if (parent !== undefined) {
            fullKey = parent + '[' + fullKey + ']';
          }
          // fullKey = `[${addToKey}]${fullKey}`;
          if (object[k] instanceof File || object[k] instanceof Date) {
            result[fullKey] = object[k];
          } else if (typeof object[k] === 'object') {
            flattenObjectLocal(object[k], fullKey);
          } else {
            result[fullKey] = object[k];
          }
        }
      }
    };
    flattenObjectLocal(data, addToKey);
    return result;
  },
  createFormData(data: any) {
    if (!data.hasFiles) {
      return data.data || data;
    } else {
      const result: any = {};
      const formData = new FormData();
      const objectToFormData = function (object: any, parent: string | number =  '') {
        if (object) {
          if (object instanceof Array) {
            if (!object.length && parent) {
              result[`${parent}[]`] = null;
            } else {
              object.forEach((v, k: any) => {
                let fullKey = k;
                if (parent !== undefined && `${parent}`.length > 0) {
                  fullKey = parent + '[' + fullKey + ']';
                }
                if (
                  object[k] instanceof File ||
                  object[k] instanceof Date) {
                  result[fullKey] = object[k];
                } else if (object[k] instanceof Object) {
                  objectToFormData(object[k], fullKey);
                } else {
                  result[fullKey] = object[k];
                }
              });
            }
          } else {
            for (const k of Object.keys(object)) {
              let fullKey = k;
              if (parent !== undefined) {
                fullKey = parent + '[' + fullKey + ']';
              }
              if (
                object[k] instanceof File ||
                object[k] instanceof Date) {
                result[fullKey] = object[k];
              } else if (object[k] instanceof Object) {
                objectToFormData(object[k], fullKey);
              } else {
                result[fullKey] = object[k];
              }
            }
          }
        }
      };
      objectToFormData(data.data);
      for (const k of Object.keys(result)) {
        const value = result[k] === null || result[k] === undefined || result[k] === 'null' ? '' : result[k];
        formData.append(k, value);
      }
      return formData;
    }
  },
  printFormData(formData: any) {
    for (var pair of formData.entries()) {
      console.info(pair[0] + ': ' + pair[1]);
    }
  },
  objectValues(object: any) {
    return Object.keys(object).map(key => object[key]);
  },
  getCookie(name: string) {
    let match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  }
};