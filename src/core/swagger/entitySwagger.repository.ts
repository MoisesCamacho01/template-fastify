export interface EntitySwaggerRepository {
    body: () => Promise<Record<string, unknown>>;
    required: () => Promise<string[]>;
}