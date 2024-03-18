/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { FastifyInstance } from "fastify";
import { UsersController } from "../../../controllers/users.controller";
import { Swagger } from "../../../core/swagger/swagger";
import { auth } from "../../../core/middelware/middelware";


export default async function userRoutes(route: FastifyInstance, options: any, done: () => void) {
	const sw: Swagger = new Swagger();
	const users: UsersController = new UsersController();
	let get = await sw.swaggerGet({ description: 'get users', tags: ['users'], summary: 'Get all users' });
	// body
	let createUser = {
		name: { type: 'string' },
		last_name: { type: 'string' }
	};

	let paramsUser = {
		id:{type: 'string', description: 'user id'}
	}

	let post = await sw.swaggerPost({ description: 'create user', tags: ['users'], summary: 'create users', required: ['name'], properties: createUser });

	let put = await sw.swaggerPut({ description: 'put user', tags: ['users'], summary: 'put user', required: ['name'], properties: createUser, paramsRequired:['id'], params:paramsUser });

	let patch = await sw.swaggerPatch({ description: 'patch user', tags: ['users'], summary: 'patch user', required: ['name'], properties: createUser, paramsRequired:['id'], params:paramsUser });

	let deleteUser = await sw.swaggerDelete({ description: 'delete user', tags: ['users'], summary: 'delete user', paramsRequired:['id'], params:paramsUser });

	route.get(`/`, { preHandler: [auth], schema: get.schema }, users.find);

	route.post(`/create`, post, users.create);

	route.put(`/put/:id`, put, users.update);

	route.patch(`/patch/:id`, patch, users.patch);

	route.delete(`/delete/:id`, deleteUser, users.delete);

	done();
}

