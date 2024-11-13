import * as fs from "fs-extra";
import { methodInterface } from "./method.interface";
import { EntitySwaggerRepository } from "./entitySwagger.repository";

export class Swagger {

	public get:any;
	public post:any;
	public put:any;
	public patch:any;
	public del:any;

	constructor(
		private readonly swagger: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/swagger.json`, 'utf8')),
		private readonly methods: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/methods.json`, 'utf8')),
		private readonly httpCode: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/httpCode.json`, 'utf8')),
		private readonly url: string = (process.env.NODE_ENV == 'dev') ? `${process.env.DOMAIN}:${process.env.PORT}` : `${process.env.DOMAIN}`
	) { 
	}

	public entity = async (entity:EntitySwaggerRepository) => {
		this.get = this.swaggerGet(await entity.get());
		this.post = this.swaggerPost(await entity.post());
		this.put = this.swaggerPut(await entity.put());
		this.patch = this.swaggerPatch(await entity.patch());
		this.del = this.swaggerDelete(await entity.del());
	} 

	public getOpenApi = (versions: string[], callback: (data: any) => void): void => {
		let sw: any = this.swagger;
		let urls = versions.map(version => ({ url: `${this.url}/${version}` }));
		sw.openapi.servers = urls;
		callback(sw.openapi);
	}

	private swaggerGet = (data: methodInterface) => {
		let methods: any = this.methods;
		let httpCode = this.httpCode;

		methods.get.schema.description = data.description;
		methods.get.schema.tags = data.tags;
		methods.get.schema.summary = data.summary;
		methods.get.schema.response = httpCode;

		return methods.get;
	}

	private swaggerPost = (data: methodInterface) => {
		
		let methods: any = this.methods;
		let httpCode = this.httpCode;

		methods.post.schema.description = data.description;
		methods.post.schema.tags = data.tags;
		methods.post.schema.summary = data.summary;
		methods.post.schema.body.required = data.required;
		methods.post.schema.body.properties = data.properties;
		methods.post.schema.response = httpCode;

		return methods.post;
	}

	private swaggerPut = (data: methodInterface) => {
		let methods: any = this.methods;
		let httpCode = this.httpCode;

		methods.put.schema.description = data.description;
		methods.put.schema.tags = data.tags;
		methods.put.schema.summary = data.summary;
		methods.put.schema.params.required = data.paramsRequired;
		methods.put.schema.params.properties = data.params;
		methods.put.schema.body.required = data.required;
		methods.put.schema.body.properties = data.properties;
		methods.put.schema.response = httpCode;

		return methods.put;
	}

	private swaggerPatch = (data: methodInterface) => {
		let methods: any = this.methods;
		let httpCode = this.httpCode;

		methods.patch.schema.description = data.description;
		methods.patch.schema.tags = data.tags;
		methods.patch.schema.summary = data.summary;
		methods.delete.schema.params.required = data.paramsRequired;
		methods.delete.schema.params.properties = data.params;
		methods.patch.schema.body.required = data.required;
		methods.patch.schema.body.properties = data.properties;
		methods.patch.schema.response = httpCode;

		return methods.patch;
	}

	private swaggerDelete = (data:methodInterface) => {
		let methods: any = this.methods;
		let httpCode = this.httpCode;

		methods.delete.schema.description = data.description;
		methods.delete.schema.tags = data.tags;
		methods.delete.schema.summary = data.summary;
		methods.delete.schema.params.required = data.paramsRequired;
		methods.delete.schema.params.properties = data.params;
		methods.delete.schema.response = httpCode;

		return methods.delete;
	}
}
