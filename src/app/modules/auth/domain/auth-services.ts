export interface PasswordVerifier {
	verify(password: string, hashedPassword: string): Promise<boolean>;
}

export interface PasswordHasher {
	hash(password: string): Promise<string>;
}

export interface TokenGenerator {
	generate(): string;
}

export interface TokenStore {
	save(key: string, value: string, ttlInSeconds: number): Promise<void>;
	get(key: string): Promise<string | null>;
	delete(key: string): Promise<void>;
}
