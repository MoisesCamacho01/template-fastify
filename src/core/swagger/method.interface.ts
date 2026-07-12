
export interface methodInterface {
	description: string;
	tags: string[];
	summary: string;
	required?: string[];
	properties?: object;
	paramsRequired?: string[];
	params?: object;
	requestBody?: object;
}
