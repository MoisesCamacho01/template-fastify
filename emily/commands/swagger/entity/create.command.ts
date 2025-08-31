import { Command } from 'commander';
import prompts from 'prompts';
import Validate from '../../../core/prompts/validate';
import { fieldInterface } from '../../../core/interfaces/field.interfaces';
import * as fs from 'fs';
import * as path from 'path';

export default (program: Command) => {
    program
        .command('swagger:entity-create')
        .description('Create entity to swagger')
        .action(async () => {

            /*
                1) enter the name of the entity
                2) enter the name of the field
                3) enter the type of field
                4) enter whether it is required or not
                5) ask if you want to enter another field
            */
            
            let validate = new Validate();
            let entity = await prompts([
                {
                    type: 'text',
                    name: 'name',
                    message: 'Enter name entity',
                    validate: value => validate.entityExist(value)
                },
            ]);
            
            let repeat: boolean = true;
            let fields: fieldInterface[] = [];
            let required: fieldInterface[] = [];
            let createEntity: boolean = false;
            let image = false;
            
            do {
                createEntity = false;
            
                let field = await prompts([
                    {
                        type: 'text',
                        name: 'name',
                        message: 'Enter name field',
                        validate: value => validate.firstCharacter(value)
                    },
                    {
                        type: 'select',
                        name: 'type',
                        message: 'Select data type',
                        choices: [
                            { title: 'Integer', value: 'integer' },
                            { title: 'Number', value: 'number' },
                            { title: 'String', value: 'string' },
                            { title: 'Boolean', value: 'boolean' },
                            { title: 'Date', value: 'date' },
                            { title: 'Datetime', value: 'datetime' },
                            { title: 'Array', value: 'array' },
                            { title: 'Object', value: 'object' },
                            { title: 'File', value: 'binary' },
                            { title: 'FileArray', value: 'binaryArray' },
                        ],
                    },
                    {
                        type: 'toggle',
                        name: 'Required',
                        message: 'Is required?',
                        initial: false,
                        active: 'No',
                        inactive: 'Yes'
                    }
                ]);
            
                let other = await prompts([
                    {
                        type: 'toggle',
                        name: 'otherField',
                        message: 'You want to enter another field?',
                        initial: true,
                        active: 'Yes',
                        inactive: 'No'
                    }
                ]);
            
                fields.push({
                    name: field.name,
                    type: field.type,
                    required: field.Required
                });
            
                repeat = other.otherField
                createEntity = (other.otherField === undefined || other.otherField) ? false : true;
            
            } while (repeat);
            
            if (createEntity) {
                let pathProject = process.cwd();
                let pathTemplate = path.join(pathProject, '/emily/templates/entitySwagger.txt')
            
                console.log("Fields :", fields);
            
                fs.readFile(pathTemplate, 'utf-8', (err, data) => {
                    
            
                    required = fields.filter(field => field.required);
            
                    let modifiedData: string = '';
            
                    modifiedData = data.replace(/<Entity>/g, validate.capitalizeFirstLetter(validate.toCamelCase(entity.name)));
                    modifiedData = modifiedData.replace(/<GroupEntity>/g, entity.name);
                    
                    let fieldBody:string = '{\n';
            
                    let ultimateField:number = fields.length;
                    let i:number = 0;

                    
                    fields.forEach(field => {
                        // Replace <body>
                        fieldBody += `\t\t\t${validate.toCamelCase(field.name)}: { \n`;
                        
                        if(field.type === 'array' || field.type === 'binaryArray'){
                            fieldBody += `\t\t\t\ttype: '${field.type}',\n`;
                            fieldBody += `\t\t\t\titems: {\n \t\t\t\t\toneOf: [\n \t\t\t\t\t\t{ type: 'string' },\n \t\t\t\t\t\t{ type: 'number' },\n \t\t\t\t\t\t{ type: 'string', format: 'binary' }\n \t\t\t\t\t]\n \t\t\t\t}\n`;
                        }else if(field.type === 'binary'){
                            fieldBody += `\t\t\t\ttype: 'string',\n`;
                            fieldBody += `\t\t\t\tformat: 'binary'\n`;
                        }else{
                            fieldBody += `\t\t\t\ttype: '${field.type}'\n`;
                        }

                        if(field.type === 'binary' || field.type === 'binaryArray'){
                            image = true;
                        }

                        if(i < ultimateField - 1){
                            fieldBody += `\t\t\t},\n`
                        }else{
                            fieldBody += `\t\t\t}\n`
                        }
                        i = i+1;
                    });
                    fieldBody += '\t\t};';

                    i = 0;
                    let fieldRequired:string = '[';
                    ultimateField = required.length;
                    required.forEach(field => {
                        if(i < ultimateField - 1){
                            if(field.required) fieldRequired += `'${validate.toCamelCase(field.name)}',`;
                        }else{
                            if(field.required) fieldRequired += `'${validate.toCamelCase(field.name)}'`;
                        }
                        i = i+1;
                    });
                    fieldRequired += '];';
            
                    modifiedData = modifiedData.replace(/<body>/g, fieldBody);
                    modifiedData = modifiedData.replace(/<required>/g, fieldRequired);

                    if(image){
                        let multipart = `\n\t\t\tpost.schema.consumes = ['multipart/form-data'];\n`;
                        modifiedData = modifiedData.replace(/<filePost>/g, multipart);
                        multipart = `\n\t\t\tput.schema.consumes = ['multipart/form-data'];\n`;
                        modifiedData = modifiedData.replace(/<filePut>/g, multipart);
                        multipart = `\n\t\t\tpatch.schema.consumes = ['multipart/form-data'];\n`;
                        modifiedData = modifiedData.replace(/<filePatch>/g, multipart);
                    }else{
                        modifiedData = modifiedData.replace(/<filePost>/g, '');
                        modifiedData = modifiedData.replace(/<filePut>/g, '');
                        modifiedData = modifiedData.replace(/<filePatch>/g, '');
                    }

            
                    // Path to save the file as .ts
                    let nameFile = validate.toCamelCase(entity.name);
            
                    let newFilePath = path.join(pathProject, `/src/app/swagger/${nameFile}.swagger.ts`);

                    // Save the modified file as a TypeScript file
                    fs.writeFile(newFilePath, modifiedData, 'utf-8', (err) => {
                        if (err) {
                            console.error(`Error save file ${newFilePath}`, err);
                        } else {
                            console.log(`Save file successfully ${newFilePath}`);
                        }
                    });
                    
                });
            }
        });
};
