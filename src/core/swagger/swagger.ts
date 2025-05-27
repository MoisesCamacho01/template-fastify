import * as fs from "fs-extra";

export class Swagger {

	constructor(
		private readonly swagger: object = JSON.parse(fs.readFileSync(`${__dirname}/../../../swagger/swagger.json`, 'utf8')),
		
		private readonly url: string = (process.env.NODE_ENV === 'dev') ? `${process.env.DOMAIN}:${process.env.PORT}` : `${process.env.DOMAIN}`
	) {}

	public getOpenApi = (versions: string[], callback: (data: any) => void): void => {
		let sw: any = this.swagger;
		let urls = versions.map(version => ({ url: `${this.url}/${version}` }));
		sw.openapi.servers = urls;
		callback(sw.openapi);
	}

}