import { EntitySwaggerRepository } from "../../core/swagger/entitySwagger.repository";
import { methodInterface } from "../../core/swagger/method.interface"

export class UserSwagger implements EntitySwaggerRepository {

    public entity:string = 'User';

    constructor(){

    }

    public body = async ():Promise<Object> => {
        return {
            name: { type: 'string' },
            last_name: { type: 'string' }
        }
    }

    public required = async ():Promise<string[]> => {
        return ['name']
    }

    public params = async ():Promise<Object> => {
        return {
            id: { type: 'string', description: 'user id' }
        }
    }

    public paramsRequired = async ():Promise<string[]> => {
        return ['id']
    }

    public get = async ():Promise<methodInterface> => {
        let methods: methodInterface = {
            description: `Get ${this.entity}(s/es)`,
            tags: [`${this.entity}(s/es)`],
            summary: `Get all ${this.entity}(s/es)`
        };
        return methods;
    }

    public post = async ():Promise<methodInterface> => {
        let methods: methodInterface = { 
            description: `Create ${this.entity}`, 
            tags: [`${this.entity}(s/es)`], 
            summary: `Create ${this.entity}`, 
            required: await this.required(), 
            properties: await this.body()
        }
        return methods
    }

    public put = async ():Promise<methodInterface> => {
        let methods: methodInterface = { 
            description: `Put ${this.entity}`, 
            tags: [`${this.entity}(s/es)`], 
            summary: `Put ${this.entity}`, 
            required: await this.required(), 
            properties: this.body(), 
            paramsRequired: await this.paramsRequired(), 
            params: await this.params()
        }
        return methods
    }

    public patch = async ():Promise<methodInterface> => {
        let methods: methodInterface = {
            description: `Patch ${this.entity}`, 
            tags: [`${this.entity}(s/es)`], 
            summary: `Patch ${this.entity}`,
            required: await this.required(), 
            properties: this.body(), 
            paramsRequired: await this.paramsRequired(), 
            params: await this.params()
        }

        return methods;
    }

    public del = async ():Promise<methodInterface> => {
        let methods: methodInterface = { 
            description: `Delete ${this.entity}`, 
            tags: [`${this.entity}(s/es)`], 
            summary: `Delete ${this.entity}`, 
            paramsRequired: await this.paramsRequired(), 
            params: await  this.params()
        }

        return methods
    }


}