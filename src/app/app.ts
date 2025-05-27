import Fastify, { FastifyInstance } from "fastify";
import routesV1 from "./routes/v1/index.routes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyMongodb from "@fastify/mongodb";
import fastifyPostgres from "@fastify/postgres";
import cors from '@fastify/cors'
import { Swagger } from "@core/swagger/swagger";
import jwtAuth from "@src/plugins/jwtAuth";

const app: FastifyInstance = Fastify({
	logger: true
});

if (process.env.MONGO_URL !== ''){
	app.register(fastifyMongodb, {
		forceClose: true,
		url: process.env.MONGO_URL
	})
}

if(process.env.POSTGRES_URL !== ''){
	app.register(fastifyPostgres, {
		connectionString: process.env.POSTGRES_URL
	})
}

app.register(cors, {
	// put your options here
	origin: "*",
	methods: ['GET', 'POST', 'PUT', 'PATH', 'DELETE']
})

const sw: Swagger = new Swagger();
sw.getOpenApi(['v1'], (data:any) => {
	app.register(fastifySwagger, {
		openapi: data
	});

	app.register(fastifySwaggerUi, {
		routePrefix: "/",
		uiConfig: {
			docExpansion: "list",
			deepLinking: false,
		},
		uiHooks: {
			onRequest: function (request, reply, next) {
				next();
			},
			preHandler: function (request, reply, next) {
				next();
			},
		},
		staticCSP: true,
		transformStaticCSP: header => header,
		transformSpecification: (swaggerObject, request, reply) => {
			return swaggerObject;
		},
		transformSpecificationClone: true,
		theme: {
			title: "Documentation",
			favicon: [
				{
					filename: "favicon.png",
					rel: "icon",
					sizes: "16x16",
					type: "image/png",
					content: Buffer.from("iVBOR...", "base64"),
				},
			],
		},
	});

	app.register(jwtAuth);

	// routes v1
	app.register(routesV1, { prefix: 'v1' })
});

export default app;
