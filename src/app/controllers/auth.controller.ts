import { FastifyReply as Response, FastifyRequest as Request } from "fastify"
import { AuthModel } from "@models/auth.model";
import { AuthInterface } from "@interfaces/auth.interfaces";
import { MessageInterface } from "@src/core/database/postgresql/variableTypes.interfaces";

export class AuthController{
	private readonly user: AuthModel;
	constructor(user:AuthModel){
		this.user = user;
	}

	public login = async (req: Request, res: Response) =>{
		let body:AuthInterface = req.body as AuthInterface;

		let user:MessageInterface = await this.user.getAuth(body.email, body.password);

		if(!user.error){
			return res.status(200).send({
				ok: false,
				message: user.message,
				body: user.rows
			});
		}

		return res.status(400).send({
			ok: false,
			message: user.message
		});


	}
}