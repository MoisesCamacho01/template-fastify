import type { FastifyReply as Response, FastifyRequest as Request } from "fastify";
import type { LoginDto, LoginMetadataDto, RegisterUserDto } from "../../application/dtos/auth.dtos";
import type { Login } from "../../application/use_case/Login";
import type { Register } from "../../application/use_case/Register";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../../domain/exceptions/auth.exceptions";

export class AuthController {
	public constructor(
		private readonly registerUseCase: Register,
		private readonly loginUseCase: Login,
	) {}

	public register = async (req: Request<{ Body: RegisterUserDto }>, res: Response) => {
		try {
			const result = await this.registerUseCase.execute(req.body);
			return res.status(201).send({ ok: true, message: "User registered successfully", body: result });
		} catch (error) {
			return this.handleError(error, res);
		}
	};

	public login = async (req: Request<{ Body: LoginDto }>, res: Response) => {
		try {
			const result = await this.loginUseCase.execute(req.body, this.buildLoginMetadata(req));
			return res.status(200).send({ ok: true, message: "Login successfully", body: result });
		} catch (error) {
			return this.handleError(error, res);
		}
	};

	private readonly buildLoginMetadata = (req: Request): LoginMetadataDto => ({
		ip: this.getHeader(req, "x-forwarded-for") ?? req.ip ?? "unknown",
		userAgent: this.getHeader(req, "user-agent") ?? "",
	});

	private readonly getHeader = (req: Request, name: string): string | undefined => {
		const value = req.headers[name];
		if (Array.isArray(value)) return value[0];
		return value;
	};

	private readonly handleError = (error: unknown, res: Response) => {
		if (error instanceof UserAlreadyExistsError) {
			return res.status(409).send({ ok: false, message: error.message, body: {} });
		}

		if (error instanceof InvalidCredentialsError) {
			return res.status(401).send({ ok: false, message: error.message, body: {} });
		}

		return res.status(500).send({ ok: false, message: "Unexpected error", body: {} });
	};
}
