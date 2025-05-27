import type { FastifyInstance } from "fastify";
import { Model } from "./model";

export class AuthModel extends Model {

	constructor(
		app:FastifyInstance,
	){
		super(app);
		this.table = 'users';
	}

	public getAuth = async (email:string, password:string) => {
		try {
			
			let valid = await this.verifyPassword(password, '$2b$10$mm9J4IJ7aaafJOyigBrCp.UfQ8/86pnk5oLGpmaLm6yR6AwGvjxXO');

			let data = {};
			if(valid){

                data = {
                    password,
                    email: email
                }
                
                return this.getResponse({
                    error:false, 
                    message:'Credentials successfully', 
                    rows:this.fastify.jwt.sign(data)
                });
			}

			return this.getResponse({error:true, message:'Credentials Error'});

		} catch (error) {
			return this.getResponse({error:true, message:error});
		}
	}

}