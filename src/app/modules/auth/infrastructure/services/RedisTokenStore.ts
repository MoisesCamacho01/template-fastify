import { RedisDatabase } from "@/core/database/redis/redis";
import type { TokenStore } from "../../domain/auth-services";

export class RedisTokenStore implements TokenStore {
	private readonly redis: RedisDatabase;

	public constructor() {
		this.redis = new RedisDatabase();
	}

	public save = async (key: string, value: string, ttlInSeconds: number): Promise<void> => {
		await this.redis.set(key, value, ttlInSeconds);
	};

	public get = async (key: string): Promise<string | null> => {
		return await this.redis.get(key);
	};

	public delete = async (key: string): Promise<void> => {
		await this.redis.del(key);
	};
}
