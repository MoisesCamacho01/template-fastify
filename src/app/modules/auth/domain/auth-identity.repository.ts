import type { LoginMetadataDto, RegisterUserDto } from "../application/dtos/auth.dtos";

export interface AuthUserIdentity {
	id: string;
	username: string;
	passwordHash: string;
	status: string;
}

export interface AuthSessionIdentity {
	id: string;
	idUser: string;
	sessionCode: string;
	expiresAt: Date;
}

export interface AuthIdentityRepository {
	findUserByUsername(username: string): Promise<AuthUserIdentity | null>;
	registerUser(data: RegisterUserDto, passwordHash: string): Promise<AuthUserIdentity>;
	createSession(user: AuthUserIdentity, metadata: LoginMetadataDto): Promise<AuthSessionIdentity>;
}
