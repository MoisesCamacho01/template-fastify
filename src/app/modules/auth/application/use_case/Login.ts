import type { AuthTokensDto, LoginDto, LoginMetadataDto } from "../dtos/auth.dtos";
import type { PasswordVerifier, TokenGenerator, TokenStore } from "../../domain/auth-services";
import type { AuthIdentityRepository, AuthUserIdentity } from "../../domain/auth-identity.repository";
import { InvalidCredentialsError } from "../../domain/exceptions/auth.exceptions";

const ACCESS_TOKEN_SECONDS = 24 * 60 * 60;

export class Login {
	public constructor(
		private readonly authRepository: AuthIdentityRepository,
		private readonly passwordVerifier: PasswordVerifier,
		private readonly tokenGenerator: TokenGenerator,
		private readonly tokenStore: TokenStore,
	) {}

	public execute = async (data: LoginDto, metadata: LoginMetadataDto): Promise<AuthTokensDto> => {
		const user = await this.authRepository.findUserByUsername(data.username);

		if (user === null || user.status !== "ACTIVE") {
			throw new InvalidCredentialsError();
		}

		const passwordIsValid = await this.passwordVerifier.verify(data.password, user.passwordHash);

		if (!passwordIsValid) {
			throw new InvalidCredentialsError();
		}

		const session = await this.authRepository.createSession(user, metadata);
		const accessToken = this.tokenGenerator.generate();

		await this.tokenStore.save(
			`access-token:${accessToken}`,
			JSON.stringify({
				idUser: user.id,
				idSession: session.id,
				username: user.username,
			}),
			ACCESS_TOKEN_SECONDS,
		);

		return {
			accessToken,
			expiresAt: session.expiresAt,
			user: this.toPublicUser(user),
		};
	};

	private readonly toPublicUser = (user: AuthUserIdentity): AuthTokensDto["user"] => ({
		id: user.id,
		username: user.username,
		status: user.status,
	});
}
