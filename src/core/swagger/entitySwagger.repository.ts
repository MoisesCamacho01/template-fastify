import { methodInterface } from "./method.interface";

export interface EntitySwaggerRepository {
    body():Promise<Object>;
    required():Promise<string[]>;
    params():Promise<Object>;
    paramsRequired():Promise<string[]>;
    get():Promise<methodInterface>;
    post():Promise<methodInterface>;
    put():Promise<methodInterface>;
    patch():Promise<methodInterface>;
    del():Promise<methodInterface>;
}