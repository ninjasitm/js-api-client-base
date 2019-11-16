import base from "../../services/utils";
export default {
	...base,
	...{
		addToStateData(state, originalItem, stateIsTarget, push) {
			const addData = function(_state, _item) {
				if (_state instanceof Array) {
					const filteredState = _state.filter(c => c instanceof Object);
					const index = filteredState.findIndex(
						current => current instanceof Object && current.id === _item.id
					);
					if (index > -1) {
						const existing = filteredState.find(
							current => current instanceof Object && current.id === _item.id
						);
						if (existing instanceof Object) {
							_state.splice(index, 1, {
								...existing,
								..._item
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
			items.forEach(item => {
				if (stateIsTarget === true) {
					addData(state, item);
				} else {
					addData(state.data.data, item);
					state.all.push(item);
					state.data.total = state.data.data.length;
				}
			});
		},
		updateStateData(state, originalItem, stateIsTarget, addToState) {
			const items =
				originalItem instanceof Array ? originalItem : [originalItem];
			const updateData = function(_state, _item) {
				const filteredState = _state.filter(c => c instanceof Object);
				const index = filteredState.findIndex(
					current => current instanceof Object && current.id === _item.id
				);
				if (_state instanceof Array) {
					const filteredState = _state.filter(c => c instanceof Object);
					const index = filteredState.findIndex(
						current => current instanceof Object && current.id === _item.id
					);
					if (index > -1) {
						const existing = filteredState.find(
							current => current instanceof Object && current.id === _item.id
						);
						if (existing instanceof Object) {
							_state.splice(index, 1, {
								...existing,
								..._item
							});
						} else {
							_state.splice(index, 1, _item);
						}
					} else if (addToState) {
						this.addToStateData(state, _item, stateIsTarget);
					}
				}
			};
			items.forEach(item => {
				if (stateIsTarget === true) {
					updateData(state, item);
				} else {
					updateData(state.data.data, item);
				}
			});
		},
		removeFromStateData(state, originalItem, stateIsTarget) {
			const items =
				originalItem instanceof Array ? originalItem : [originalItem];
			const removeData = function(_state, _item) {
				const index = _state.findIndex(current => {
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
			};
			items.forEach(item => {
				const id = item instanceof Object ? item.id : item;
				if (stateIsTarget === true) {
					removeData(state, id);
				} else {
					removeData(state.data.data, id);
					state.data.total = state.data.data.length;
				}
			});
		},
		findItemInState(state, item, stateIsTarget) {
			const itemId = item instanceof Object ? item.id : item;
			if (stateIsTarget === true) {
				return state.findIndex(
					current => current instanceof Object && current.id == itemId
				);
			} else {
				return state.data.data.findIndex(
					current => current instanceof Object && current.id == itemId
				);
			}
		},
		getItemInState(state, item, stateIsTarget) {
			const itemId = item instanceof Object ? item.id : item;
			if (stateIsTarget === true) {
				return state.find(current => current.id == itemId);
			} else {
				return state.data.data.find(
					current => current instanceof Object && current.id == itemId
				);
			}
		}
	}
};
