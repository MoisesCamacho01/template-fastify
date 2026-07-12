import crypto from "node:crypto";
import type { TokenGenerator } from "../../domain/auth-services";

export class CryptoTokenGenerator implements TokenGenerator {
	public generate = (): string => {
		return crypto.randomBytes(48).toString("hex");
	};
}
