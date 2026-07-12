import bcrypt from "bcrypt";
import type { PasswordVerifier } from "../../domain/auth-services";

export class BcryptPasswordVerifier implements PasswordVerifier {
	public verify = async (password: string, hashedPassword: string): Promise<boolean> => {
		return await bcrypt.compare(password, hashedPassword);
	};
}
