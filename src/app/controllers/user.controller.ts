import { FastifyReply as Response, FastifyRequest as Request } from "fastify"
import { UserInterface } from "@interfaces/user.interfaces"
import { UsersModel } from "@src/app/models/users.model"
import { MessageInterface } from "@src/core/database/postgresql/variableTypes.interfaces";

export class UserController {
	private readonly usersModel: UsersModel;
	constructor(
		usersModel: UsersModel,
	) {
		this.usersModel = usersModel;
	}

	public find = async (req: Request, res: Response) => {

		let params = req.params as {id:string}
		let user:MessageInterface = await this.usersModel.find(params.id);
		let rows:UserInterface = user.rows as UserInterface;

		if(!user.error){
			return res.status(200).send({
				ok: true,
				message: 'Users recovered successfully',
				body: rows
			});
		}

		return res.status(400).send({
			ok: false,
			message: user.message,
			body: {}
		});
	}

	public list = async (req: Request, res: Response) => {

		let listUsers:MessageInterface = await this.usersModel.list();

		let rows:UserInterface[] = listUsers.rows as UserInterface[];

		if(!listUsers.error){
			return res.status(200).send({
				ok: true,
				message: 'Users All recovered successfully',
				body: rows
			})
		}

		return res.status(400).send({
			ok: false,
			message: listUsers.message
		});

	}

	public create = async (req: Request, res: Response) => {

		let body: any = req.body

		let user: UserInterface = {
			name: body.name,
			email: body.email,
			password: body.password,
		}

		let createUser: MessageInterface = await this.usersModel.create(user);

		if (!createUser.error) {
			return res.status(200).send({
				ok: true,
				message: 'User created successfully',
				body: createUser
			});
		}

		return res.status(400).send({
			ok: false,
			message: createUser.message
		});
	}

	public patch = async (req: Request, res: Response) => {

		let body:UserInterface = req.body as UserInterface
		let params = req.params as {id:string}

		let update:MessageInterface = await this.usersModel.patch(body, params.id);

		if(!update.error){
			return res.status(200).send({
				ok: true,
				message: 'User updated successfully',
			});
		}

		return res.status(400).send({
			ok: false,
			message: update.message
		})
	}

	public delete = async (req: Request, res: Response) => {

		let params = req.params as {id:string}

		let deleteUser:MessageInterface = await this.usersModel.del(params.id);

		if(!deleteUser.error){
			return res.status(200).send({
				ok: true,
				message: 'User delete successfully',
			});
		}

		return res.status(400).send({
			ok: false,
			message: deleteUser.message
		})
	}
}
