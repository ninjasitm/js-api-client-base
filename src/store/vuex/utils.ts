import base from "../../services/utils";
const utils: any = {
	...base,
	...{
		addToStateData(
			state: Array<any> | any,
			originalItem: any,
			stateIsTarget: boolean = false,
			push: boolean = false
		) {
			const addData = function (_state: Array<any> | any, _item: any) {
				if (_state instanceof Array) {
					const filteredState: Array<any> = _state.filter(
						(c) => c instanceof Object
					);
					const index = filteredState.findIndex(
						(current: any) =>
							current instanceof Object && current.id === _item.id
					);
					if (index > -1) {
						const existing = filteredState.find(
							(current) => current instanceof Object && current.id === _item.id
						);
						if (existing instanceof Object) {
							_state.splice(index, 1, {
								...existing,
								..._item,
							});
						} else {
							_state.splice(index, 1, _item);
						}
					} else if (push) {
						_state.push(_item);
					} else {
						_state.unshift(_item);
					}
				}
			};
			const items =
				originalItem instanceof Array ? originalItem : [originalItem];
			items.forEach((item) => {
				if (stateIsTarget === true) {
					addData(state, item);
				} else {
					addData(state.data.data, item);
					state.all.push(item);
					state.data.total = state.data.data instanceof Array ? state.data.data.length : state.all.length;
				}
			});
		},
		updateStateData(
			state: Array<any> | any,
			originalItem: any,
			stateIsTarget: boolean = false,
			addToState: boolean = false
		) {
			const items =
				originalItem instanceof Array ? originalItem : [originalItem];
			const updateData = function (_state: Array<any> | any, _item: any) {
				if (_state instanceof Array) {
					const filteredState: Array<any> = _state.filter(
						(c) => c instanceof Object
					);
					const index = filteredState.findIndex(
						(current) => current instanceof Object && current.id === _item.id
					);
					if (index > -1) {
						const existing = filteredState.find(
							(current) => current instanceof Object && current.id === _item.id
						);
						if (existing instanceof Object) {
							_state.splice(index, 1, {
								...existing,
								..._item,
							});
						} else {
							_state.splice(index, 1, _item);
						}
					} else if (addToState) {
						utils.addToStateData(state, _item, stateIsTarget);
					}
				}
			};
			items.forEach((item) => {
				if (stateIsTarget === true) {
					updateData(state, item);
				} else {
					updateData(state.data.data, item);
				}
			});
		},
		removeFromStateData(
			state: Array<any> | any,
			originalItem: any,
			stateIsTarget: boolean = false
		) {
			const items =
				originalItem instanceof Array ? originalItem : [originalItem];
			const removeData = function (_state: Array<any> | any, _item: any) {
				if (_state instanceof Array) {
					const index = _state.findIndex((current: any) => {
						if (current instanceof Object) {
							return current.id === _item;
						} else if (_item instanceof Function) {
							return _item(current);
						} else {
							return current === _item;
						}
					});
					if (index > -1) {
						_state.splice(index, 1);
					}
				}
			};
			items.forEach((item) => {
				const id = item instanceof Object ? item.id : item;
				if (stateIsTarget === true) {
					removeData(state, id);
				} else {
					removeData(state.data.data, id);
					state.data.total = state.data.data instanceof Array ? state.data.data.length : state.all.length;
				}
			});
		},
		findItemInState(
			state: Array<any> | any,
			item: any,
			stateIsTarget: boolean = false
		) {
			const itemId = item instanceof Object ? item.id : item;
			if (stateIsTarget === true) {
				return state.findIndex(
					(current: any) => current instanceof Object && current.id == itemId
				);
			} else {
				return state.data.data.findIndex(
					(current: any) => current instanceof Object && current.id == itemId
				);
			}
		},
		getItemInState(
			state: Array<any> | any,
			item: any,
			stateIsTarget: boolean = false
		) {
			const itemId = item instanceof Object ? item.id : item;
			if (stateIsTarget === true) {
				return state.find((current: any) => current.id == itemId);
			} else {
				return state.data.data.find(
					(current: any) => current instanceof Object && current.id == itemId
				);
			}
		},
	},
};
export default utils;
