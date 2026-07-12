export class InvalidCredentialsError extends Error {
	public constructor() {
		super("Invalid credentials");
		this.name = "InvalidCredentialsError";
	}
}

export class UserAlreadyExistsError extends Error {
	public constructor() {
		super("User already exists");
		this.name = "UserAlreadyExistsError";
	}
}
