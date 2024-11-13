import { FastifyReply as Response, FastifyRequest as Request } from "fastify"

export class UsersController {
	

	public find = async (req: Request, res: Response) => {
		return res.status(200).send({
			ok: true,
			message: 'Users recovered successfully',
			body: {}
		})
	}

	public create = async (req: Request, res: Response) => {

		let body:any = req.body

		let resd= {
			name: body.name,
			last_name: body.last_name,
		}

		return res.status(200).send({
			ok: true,
			message: 'User created successfully '+body.name,
			body: resd
		})
	}

	public update = async (req: Request, res: Response) => {

		let body:any = req.body
		let params:any = req.params

		let resd= {
			user: params.id,
			name: body.name,
			last_name: body.last_name,
		}

		return res.status(200).send({
			ok: true,
			message: 'User put successfully '+body.name,
			body: resd
		})
	}

	public patch = async (req: Request, res: Response) => {

		let body:any = req.body
		let params:any = req.params

		let resd= {
			user: params.id,
			name: body.name,
			last_name: body.last_name,
		}

		return res.status(200).send({
			ok: true,
			message: 'User patch successfully '+body.name,
			body: resd
		})
	}

	public delete = async (req: Request, res: Response) => {

		let params:any = req.params

		let resd= {
			user: params.id,
		}

		return res.status(200).send({
			ok: true,
			message: 'User deleted successfully ',
			body: resd
		})
	}
}
