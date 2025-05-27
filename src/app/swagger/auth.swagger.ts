import * as fs from "fs-extra";
import { EntitySwaggerRepository } from "@core/swagger/entitySwagger.repository";

export class AuthSwagger implements EntitySwaggerRepository {

    public entity:string = 'Auth';
		public get: any;
		public post: any;
		public patch: any;
		public put: any;
		public del: any;
		public find: any;

    constructor(
			private readonly methods: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/methods.json`, 'utf8')),
			private readonly httpCode: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/httpCode.json`, 'utf8')),
		){}

		public loadSchema = async () => {
			this.get = await this.swaggerGet();
			this.find = await this.swaggerFind();
			this.post = await this.swaggerPost();
			this.put = await this.swaggerPut();
			this.patch = await this.swaggerPatch();
			this.del = await this.swaggerDelete();
		}

    public body = async ():Promise<Record<string, unknown>> => {
      return {
				email : { type: 'string' },
				password : { type: 'string' }
			};
    }

    public required = async ():Promise<string[]> => {
      return ['email','password'];
    }

		private readonly swaggerGet = async () => {
			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {get} = JSON.parse(JSON.stringify(this.methods));

			get.schema.description = `Get ${this.entity}s`;
			get.schema.tags = [`${this.entity}`];
			get.schema.operationId = `getAll${this.entity}`
			get.schema.summary = `Get all ${this.entity}s`;
			get.schema.response = httpCode;

			return get;
		}

		private readonly swaggerFind = async () => {
			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {get} = JSON.parse(JSON.stringify(this.methods));

			get.schema.description = `Get ${this.entity}s`;
			get.schema.tags = [`${this.entity}`];
			get.schema.operationId = `get${this.entity}ById`
			get.schema.summary = `Get one ${this.entity}`;
			get.schema.params.required = ['id'];
			get.schema.params.properties = {
				id: { type: 'string', description: 'user id' }
			};
			get.schema.response = httpCode;

			return get
		}

		private readonly swaggerPost = async () => {

			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {post} = JSON.parse(JSON.stringify(this.methods));

			post.schema.description = `Create ${this.entity}`;
			post.schema.tags = [`${this.entity}`];
			post.schema.operationId = `create${this.entity}`
			post.schema.summary = `Create ${this.entity}`;
			post.schema.body.required = await this.required();
			post.schema.body.properties = await this.body();
			post.schema.response = httpCode;
			return post;
		}

		private readonly swaggerPut = async () => {
			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {put} = JSON.parse(JSON.stringify(this.methods));

			put.schema.description = `Put ${this.entity}`;
			put.schema.tags = [`${this.entity}`];
			put.schema.operationId = `put${this.entity}`
			put.schema.summary = `Put ${this.entity}`;
			put.schema.params.required = ['id'];
			put.schema.params.properties = {
				id: { type: 'string', description: 'user id' }
			};
			put.schema.body.required = await this.required();
			put.schema.body.properties = await this.body();
			put.schema.response = httpCode;

			return put;
		}

		private readonly swaggerPatch = async () => {

			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {patch} = JSON.parse(JSON.stringify(this.methods));

			patch.schema.description = `Patch ${this.entity}`;
			patch.schema.tags = [`${this.entity}`];
			patch.schema.operationId = `update${this.entity}`
			patch.schema.summary = `Patch ${this.entity}`;
			patch.schema.params.required = ['id'];
			patch.schema.params.properties = {
				id: { type: 'string', description: 'user id' }
			};
			patch.schema.body.required = ['email'];
			patch.schema.body.properties = {
				email: { type: 'string' }
			};
			patch.schema.response = httpCode;

			return patch;
		}

		private readonly swaggerDelete = async () => {

			let httpCode: any = JSON.parse(JSON.stringify(this.httpCode));
			let {delete: del} = JSON.parse(JSON.stringify(this.methods));

			del.schema.description = `Delete ${this.entity}`;
			del.schema.tags = [`${this.entity}`];
			del.schema.operationId = `delete${this.entity}ById`
			del.schema.summary = `Delete ${this.entity}`;
			del.schema.params.required = ['id'];
			del.schema.params.properties = {
				id: { type: 'string', description: 'user id' }
			};
			del.schema.response = httpCode;

			return del;
		}
}