import type { RegisterUserDto } from "../dtos/auth.dtos";
import type { PasswordHasher } from "../../domain/auth-services";
import type { AuthIdentityRepository } from "../../domain/auth-identity.repository";
import { UserAlreadyExistsError } from "../../domain/exceptions/auth.exceptions";

export class Register {
	public constructor(
		private readonly authRepository: AuthIdentityRepository,
		private readonly passwordHasher: PasswordHasher,
	) {}

	public execute = async (data: RegisterUserDto) => {
		const existingUser = await this.authRepository.findUserByUsername(data.username);

		if (existingUser !== null) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.authRepository.registerUser(data, await this.passwordHasher.hash(data.password));

		return {
			id: user.id,
			username: user.username,
			status: user.status,
		};
	};
}
