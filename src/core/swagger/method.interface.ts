
interface Security{
	apiKey:string[]
}

interface Schema {
	description: string;
	tags: string[];
	summary: string;
	security: Security[];
	params?: {
			type: string;
			required: string[];
			properties: Record<string, unknown>;
	};
	body?: {
			type: string;
			required: string[];
			properties: Record<string, unknown>;
	};
	response: Record<string, unknown>;
}

interface Method {
	schema: Schema;
}

export interface Get{
	get?: Method;
}
export interface Post{
	post?: Method;
}
export interface Put{
	put?: Method;
}
export interface Patch{
	patch?: Method;
}
export interface Delete{
	delete?: Method;
}
