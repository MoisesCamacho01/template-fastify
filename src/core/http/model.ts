import { PostgresSQL } from "@src/core/database/postgresql/postgres";
import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";

export class Model extends PostgresSQL{

	public fastify:FastifyInstance;

	constructor(
		app:FastifyInstance
	){
		super(app);
		this.fastify = app;
	}

	public hashPassword = async (password: string) => {
		const saltRounds = 10;
		return await bcrypt.hash(password, saltRounds);
	}

	public verifyPassword = async (password: string, hashedPassword: string) => {
		return await bcrypt.compare(password, hashedPassword);
	}

}
