import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fp from 'fastify-plugin'

async function jwtAuth(app: FastifyInstance) {
    app.register(fastifyJwt, {
		secret: ''+process.env.SECRET_JWT+''
	})
	
	app.decorate("jwtAuth", async function(request:FastifyRequest, reply:FastifyReply) {
		try {
			await request.jwtVerify()
		} catch (err) {
			reply.send(err)
		}
	})
}

export default fp(jwtAuth, {
    name: 'jwtAuth'
})

declare module 'fastify' {
    interface FastifyInstance {
      jwtAuth: any 
    }
  }