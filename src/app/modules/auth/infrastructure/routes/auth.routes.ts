import type { FastifyInstance, RouteShorthandOptions } from "fastify";
import type { LoginDto, RegisterUserDto } from "../../application/dtos/auth.dtos";
import { Login } from "../../application/use_case/Login";
import { Register } from "../../application/use_case/Register";
import { AuthController } from "../controllers/AuthController";
import { DrizzleAuthIdentityRepository } from "../repositories/drizzle/DrizzleAuthIdentityRepository";
import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";
import { BcryptPasswordVerifier } from "../services/BcryptPasswordVerifier";
import { CryptoTokenGenerator } from "../services/CryptoTokenGenerator";
import { RedisTokenStore } from "../services/RedisTokenStore";
import { AuthSwagger } from "../swagger/AuthSwagger";

export default async function authRoutes(route: FastifyInstance) {
	const authRepository = new DrizzleAuthIdentityRepository();
	const passwordHasher = new BcryptPasswordHasher();
	const tokenStore = new RedisTokenStore();

	const authController = new AuthController(
		new Register(authRepository, passwordHasher),
		new Login(authRepository, new BcryptPasswordVerifier(), new CryptoTokenGenerator(), tokenStore),
	);

	const swagger = new AuthSwagger();

	route.post<{ Body: RegisterUserDto }>("/register", swagger.register(), authController.register);
	route.post<{ Body: LoginDto }>("/login", swagger.login(), authController.login);
}

export type AuthRouteOptions = RouteShorthandOptions;
