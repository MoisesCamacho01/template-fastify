import type { methodInterface } from "./method.interface";

export interface EntitySwaggerRepository {
    body: () => Promise<Record<string, unknown>>;
    required: () => Promise<string[]>;
    get: () => Promise<methodInterface>;
    post: () => Promise<methodInterface>;
    put: () => Promise<methodInterface>;
    patch: () => Promise<methodInterface>;
    del: () => Promise<methodInterface>;
}
