import { Model } from '@models/model';
import { UserInterface} from "../interfaces/user.interfaces";
import type { FastifyInstance } from "fastify";
import { MessageInterface } from '@src/core/database/postgresql/variableTypes.interfaces';

export class UsersModel extends Model {

	constructor(
		app: FastifyInstance,
	) {
		super(app);
		this.table = 'users'
	}

	public find = async (id:string) => {
		try {

			let getUser:MessageInterface = {
                error: false,
                message: 'User created successfully',
                rows: [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@doe.com',
                        password: '12345'
                    }
                ]
            }

			if(getUser.error){
				console.log({
					consult_user: getUser.message
				});
				getUser.message = "Error retrieving data";
			}

			return getUser;
		}catch(error){
			return this.getResponse({error:true, message:error})
		}
	}

	public list = async () => {
		try {
			let users: MessageInterface = {
                error: false,
                message: 'User created successfully',
                rows: [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@doe.com',
                        password: '12345'
                    },
                    {
                        id: 2,
                        name: 'John Doe',
                        email: 'john@doe.com',
                        password: '12346'
                    }
                ]
            }

			if (users.error) {
				console.log({
					Insert_user: users.message
				});
				users.message = "Error retrieving data";
			}

			return users;

		} catch (error) {
			return this.getResponse({error:true, message:error});
		}
	}

	public create = async (user: UserInterface) => {
		try {
			
			let response: MessageInterface = {
				error: false,
				message: 'User created successfully',
				rows: user
			}

			return response;

		} catch (error) {
			return this.getResponse({error:true, message:error});
		}
	}

	public patch = async (user:UserInterface, id:string) => {
		try {
			let update:MessageInterface = {
                error: false,
                message: 'User updated successfully',
                rows: [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@doe.com',
                        password: '12345'
                    },
                ]
            }
			if(update.error){
				console.log({
					Insert_user: update.message
				});
				update.message = "Error in update of data";
			}
			return update
		} catch (error) {
			return this.getResponse({error:true, message:error})
		}
	}

	public del = async (id:string) => {
		try {
			
			let deleteUser:MessageInterface = {
                error: false,
                message: 'User deleted successfully',
                rows: []
            };

			if(deleteUser.error){
				console.log({
					Insert_user: deleteUser.message
				});
				deleteUser.message = "Error in update of data";
			}
			return deleteUser
		} catch (error) {
			return this.getResponse({error:true, message:error})
		}
	}
}
