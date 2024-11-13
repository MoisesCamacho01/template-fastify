/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { FastifyInstance } from "fastify";
import { UsersController } from "../../../controllers/users.controller";
import { Swagger } from "../../../../core/swagger/swagger";
import { auth } from "../../../../core/middleware/middleware";
import { UserSwagger } from "../../../swagger/user.swagger";

export default async function userRoutes(route: FastifyInstance, options: any, done: () => void) {
	
	const userSwagger: UserSwagger = new UserSwagger();
	const sw: Swagger = new Swagger();
	await sw.entity(userSwagger);
	const users: UsersController = new UsersController();

	route.get(`/`, { preHandler: [auth], schema: sw.get.schema }, users.find);

	route.post(`/create`, sw.post, users.create);

	route.put(`/put/:id`, sw.put, users.update);

	route.patch(`/patch/:id`, sw.patch, users.patch);
	
	route.delete(`/delete/:id`, sw.del, users.delete);

	done();
}

