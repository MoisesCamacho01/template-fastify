export interface RegisterUserDto {
	username: string;
	password: string;
}

export interface LoginDto {
	username: string;
	password: string;
}

export interface LoginMetadataDto {
	ip?: string;
	userAgent?: string;
}

export interface AuthTokensDto {
	accessToken: string;
	expiresAt: Date;
	user: {
		id: string;
		username: string;
		status: string;
	};
}
