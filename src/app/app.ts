import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import routesV1 from "./routes/v1/index.routes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { Swagger } from "./core/swagger/swagger";

const app: FastifyInstance = Fastify({
	logger: true
});


const sw: Swagger = new Swagger();
sw.getOpenApi(['v1'], (data) => {

	app.register(fastifySwagger, {
		openapi: data
	});

	app.register(fastifySwaggerUi, {
		routePrefix: "/doc",
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

	// routes v1
	app.register(routesV1, { prefix: 'v1' })
});

export default app;
