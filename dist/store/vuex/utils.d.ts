declare var _default: {
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
export default _default;
