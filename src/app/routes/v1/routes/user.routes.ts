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

	await route.addHook('onRequest', route.jwtAuth);

	await route.get(`/`, { schema: sw.get.schema }, user.list);
	await route.get('/:id', { schema: sw.find.schema }, user.find)
	await route.post(`/create`, { schema: sw.post.schema }, user.create);
	await route.patch(`/patch/:id`, { schema: sw.patch.schema }, user.patch);
	await route.delete(`/delete/:id`, { schema: sw.del.schema }, user.delete);

}
