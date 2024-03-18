import { FastifyReply as Response, FastifyRequest as Request } from "fastify";

export const auth = async (req:Request, res:Response) => {
	if (req.headers.apikey !== '123456') {
		return res.status(401).send({
			message: 'Unauthorized',
		})
	}
}


