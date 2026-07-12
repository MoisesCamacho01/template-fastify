import type { RouteShorthandOptions } from "fastify";

export class AuthSwagger {
	private readonly tags = ["Auth"];

	public register = (): RouteShorthandOptions => this.usernamePasswordSchema("Register user");
	public login = (): RouteShorthandOptions => this.usernamePasswordSchema("Login user");

	private readonly usernamePasswordSchema = (summary: string): RouteShorthandOptions => ({
		schema: {
			description: summary,
			tags: this.tags,
			summary,
			body: {
				type: "object",
				required: ["username", "password"],
				properties: {
					username: { type: "string", minLength: 3 },
					password: { type: "string", minLength: 6 },
				},
			},
		},
	});
}
