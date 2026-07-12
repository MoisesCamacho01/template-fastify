import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../domain/auth-services";

export class BcryptPasswordHasher implements PasswordHasher {
	private readonly saltRounds = 10;

	public hash = async (password: string): Promise<string> => {
		return await bcrypt.hash(password, this.saltRounds);
	};
}
