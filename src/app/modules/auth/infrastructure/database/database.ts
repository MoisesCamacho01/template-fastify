import { drizzle } from "drizzle-orm/node-postgres";

export class DataBase {
	private readonly DB_URL: string;

	public constructor() {
		this.DB_URL = process.env.POSTGRES_URL!;

		if (!this.DB_URL) {
			throw new Error("Database URL is not defined in environment variables");
		}
	}

	public connect = async () => {
		return drizzle(this.DB_URL);
	};
}
