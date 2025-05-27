/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { FastifyInstance } from "fastify";

import { AuthSwagger } from "@sw/auth.swagger";
import { AuthModel } from "@src/app/models/auth.model";
import { AuthController } from "@src/app/controllers/auth.controller";

export default async function authRoutes(route: FastifyInstance, options: any) {

	const sw: AuthSwagger = new AuthSwagger();
	await sw.loadSchema();

	const authUser: AuthModel = new AuthModel(route);
	const authU: AuthController = new AuthController(authUser);

	await route.post(`/login`, { schema: sw.post.schema }, authU.login);
}

