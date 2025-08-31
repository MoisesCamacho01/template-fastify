import * as fs from 'fs';
import * as path from 'path';

export default class Validate{

    private pathProject:string = process.cwd();

    public entityExist = (value: string) => {
        const nameFile = this.toCamelCase(value);
        const FilePath = path.join(this.pathProject, `/src/app/swagger/${nameFile}.swagger.ts`);

        const firstCharacter = this.firstCharacter(value);
        if(firstCharacter != true) return firstCharacter;
        
        if(fs.existsSync(FilePath)) return `The file src/app/swagger/${nameFile}.swagger.ts already exist`;
        
        return true;
    }

    public existSwagger = (value: string) => {
        const nameFile = this.toCamelCase(value);
        const FilePath = path.join(this.pathProject, `/src/app/swagger/${nameFile}.swagger.ts`);

        const firstCharacter = this.firstCharacter(value);
        if(firstCharacter != true) return firstCharacter;
        
        if(!fs.existsSync(FilePath)) return `The file src/app/swagger/${nameFile}.swagger.ts it's not exist`;
        
        return true;
    }

    public existModel = (value:string) => {

        const nameFile = this.toCamelCase(value);
        const FilePath = path.join(this.pathProject, `/src/app/models/${nameFile}.model.ts`);

        let firstCharacter = this.firstCharacter(value);
        if(firstCharacter != true) return firstCharacter;
        if(fs.existsSync(FilePath)) return `The file src/app/interfaces/${nameFile}.model.ts already exist`;
        
        return true;
    }

    public existController = (value:string) => {

        const nameFile = this.toCamelCase(value);
        const FilePath = path.join(this.pathProject, `/src/app/controllers/${nameFile}.controller.ts`);

        let firstCharacter = this.firstCharacter(value);
        if(firstCharacter != true) return firstCharacter;
        if(fs.existsSync(FilePath)) return `The file src/app/controllers/${nameFile}.controller.ts already exist`;
        
        return true;
    }

    public existInterface = (value: string) => {
        const nameFile = this.toCamelCase(value);
        const FilePath = path.join(this.pathProject, `/src/app/interfaces/${nameFile}.interface.ts`);

        const firstCharacter = this.firstCharacter(value);
        if(firstCharacter != true) return firstCharacter;
        
        if(fs.existsSync(FilePath)) return `The file src/app/interfaces/${nameFile}.interface.ts already exist`;
        
        return true;
    }

    public firstCharacter = (value: any) => {
        const firstCharacter = value.charAt(0);
        const specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        const specialCharactersWithoutUnderscoreRegex = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;

        if (Number.isInteger(parseInt(firstCharacter))) return `The first character can't be a number`;
        if (specialCharactersRegex.test(firstCharacter)) return "The first character can't be a special character";
        if (specialCharactersWithoutUnderscoreRegex.test(value)) return "The text can only contain underscores as special characters";

        return true;
    }

    public toCamelCase = (input: string) => {

        if(this.isCamelCase(input)) return input; 

        return input
            .toLowerCase()
            .split(/[^a-zA-Z0-9]+/)
            .map((word, index) =>
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join('');  
    }

    public capitalizeFirstLetter = (text:string) => {
        if (!text){
            return text;
        }
        
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    public isCamelCase = (input: string): boolean => {
        const camelCaseRegex = /^[a-z]+([A-Z][a-z]*)*$/;
        return camelCaseRegex.test(input);
    }
}