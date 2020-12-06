export interface IApi {
	log: any,
	$app: any,
	$api: any,
	app: () => {},
	api: () => {},
	setApi(app: any, headers?: any): any,
	setApp(app: any): any,
	// revocable(method: any): any
}

export interface IStore {
	$log: any,
	$app: any,
	$api: any,
	allTypes: any,
}

export interface IStoreOptions extends Object {
	app: any,
	api: IApi,
	logger: any
}

export interface IJsApi {
	app: any,
	api: IJsApi,
	log: any
}