import type { methodInterface } from "./method.interface";
import type { EntitySwaggerRepository } from "./entitySwagger.repository";
import swaggerData from "../../../swagger/swagger.json" with { type: "json" };
import methodsData from "../../../swagger/methods.json" with { type: "json" };
import httpCodeData from "../../../swagger/httpCode.json" with { type: "json" };

export class Swagger {
    public get: any;
    public post: any;
	public put: any;
	public patch: any;
	public del: any;

	constructor(
		private readonly swagger: object = Swagger.clone(swaggerData),
		private readonly methods: object = Swagger.clone(methodsData),
		private readonly httpCode: object = Swagger.clone(httpCodeData),
	) {}

	private static readonly clone = <T>(data: T): T => {
		return JSON.parse(JSON.stringify(data)) as T;
	};

    public entity = async (entity: EntitySwaggerRepository) => {
        this.get = this.swaggerGet(await entity.get());
        this.post = this.swaggerPost(await entity.post());
        this.put = this.swaggerPut(await entity.put());
        this.patch = this.swaggerPatch(await entity.patch());
        this.del = this.swaggerDelete(await entity.del());
    };

    public getOpenApi = (versions: string[], callback: (data: any) => void): void => {
        const sw: any = this.swagger;
        const urls = versions.map((version) => ({ url: this.buildServerUrl(version) }));
        sw.openapi.servers = urls;
        callback(sw.openapi);
    };

    private readonly buildServerUrl = (version: string): string => {
        const env = process.env.NODE_ENV ?? process.env.NOVE_ENV;
        const rawDomain = process.env.DOMAIN ?? "http://localhost";
        const port = process.env.PORT ?? "4000";

        const domainWithProtocol = /^https?:\/\//i.test(rawDomain) ? rawDomain : `http://${rawDomain}`;
        const cleanDomain = domainWithProtocol.replace(/\/+$/, "");
        const hasPort = /:\d+$/.test(cleanDomain);

        const origin = env === "dev" && !hasPort ? `${cleanDomain}:${port}` : cleanDomain;

        return `${origin}/api/${version}`;
    };

    private readonly swaggerGet = (data: methodInterface) => {
        const methods: any = this.methods;
        const httpCode = this.httpCode;

        methods.get.schema.description = data.description;
        methods.get.schema.tags = data.tags;
        methods.get.schema.summary = data.summary;
        methods.get.schema.response = httpCode;
        methods.get.schema.security = [{ bearerAuth: [] }];

        return methods.get;
    };

    private readonly swaggerPost = (data: methodInterface) => {
        const methods: any = this.methods;
        const httpCode = this.httpCode;

        methods.post.schema.description = data.description;
        methods.post.schema.tags = data.tags;
        methods.post.schema.summary = data.summary;
        methods.post.schema.body.required = data.required;
        methods.post.schema.body.properties = data.properties;
        methods.post.schema.response = httpCode;
        methods.post.schema.security = [{ bearerAuth: [] }];

        return methods.post;
    };

    private readonly swaggerPut = (data: methodInterface) => {
        const methods: any = this.methods;
        const httpCode = this.httpCode;

        methods.put.schema.description = data.description;
        methods.put.schema.tags = data.tags;
        methods.put.schema.summary = data.summary;
        methods.put.schema.params.required = data.paramsRequired;
        methods.put.schema.params.properties = data.params;
        methods.put.schema.body.required = data.required;
        methods.put.schema.body.properties = data.properties;
        methods.put.schema.response = httpCode;
        methods.put.schema.security = [{ bearerAuth: [] }];

        return methods.put;
    };

    private readonly swaggerPatch = (data: methodInterface) => {
        const methods: any = this.methods;
        const httpCode = this.httpCode;

        methods.patch.schema.description = data.description;
        methods.patch.schema.tags = data.tags;
        methods.patch.schema.summary = data.summary;
        methods.patch.schema.params.required = data.paramsRequired;
        methods.patch.schema.params.properties = data.params;
        methods.patch.schema.body.required = data.required;
        methods.patch.schema.body.properties = data.properties;
        methods.patch.schema.response = httpCode;
        methods.patch.schema.security = [{ bearerAuth: [] }];

        return methods.patch;
    };

    private readonly swaggerDelete = (data: methodInterface) => {
        const methods: any = this.methods;
        const httpCode = this.httpCode;

        methods.delete.schema.description = data.description;
        methods.delete.schema.tags = data.tags;
        methods.delete.schema.summary = data.summary;
        methods.delete.schema.params.required = data.paramsRequired;
        methods.delete.schema.params.properties = data.params;
        methods.delete.schema.response = httpCode;
        methods.delete.schema.security = [{ bearerAuth: [] }];

        return methods.delete;
    };
}
