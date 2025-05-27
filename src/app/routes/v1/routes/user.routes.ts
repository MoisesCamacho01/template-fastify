/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { FastifyInstance } from "fastify";

import { UserController } from "@src/app/controllers/user.controller";
import { UserSwagger } from "@sw/user.swagger";
import { UsersModel } from "@src/app/models/users.model";

export default async function userRoutes(route: FastifyInstance, options: any) {

	const sw: UserSwagger = new UserSwagger();
	await sw.loadSchema();
	const users: UsersModel = new UsersModel(route);
	const user: UserController = new UserController(users);

	await route.get(`/`, { onRequest: [route.jwtAuth], schema: sw.get.schema }, user.list);
	await route.get('/:id', { onRequest: [route.jwtAuth], schema: sw.find.schema }, user.find)
	await route.post(`/create`, { onRequest: [route.jwtAuth], schema: sw.post.schema }, user.create);
	await route.patch(`/patch/:id`, { onRequest: [route.jwtAuth], schema: sw.patch.schema }, user.patch);
	await route.delete(`/delete/:id`, { onRequest: [route.jwtAuth], schema: sw.del.schema }, user.delete);

}
