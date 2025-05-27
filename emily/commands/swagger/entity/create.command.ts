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
                    validate: value => validate.firstCharacterNumber(value)
                },
            ]);

            let repeat:boolean = true;
            let fields:fieldInterface[] = [];
            let required:fieldInterface[] = [];
            let createEntity:boolean = false;

            do {

                createEntity = false;

                let field = await prompts([
                    {
                        type: 'text',
                        name: 'name',
                        message: 'Enter name field',
                        validate: value => validate.firstCharacterNumber(value)
                    },
                    {
                        type: 'select',
                        name: 'type',
                        message: 'Select data type',
                        choices: [
                          { title: 'String', value: 'string' },
                        ],
                    },
                    {
                        type: 'confirm',
                        name: 'Required',
                        message: 'Is required?',
                        initial: false
                    }
                ]);

                let other = await prompts([
                    {
                        type: 'confirm',
                        name: 'otherField',
                        message: 'You want to enter another field?',
                        initial: false
                    }
                ]);

                fields.push({
                    name: field.name,
                    type: field.type,
                    required: field.Required
                });

                repeat = other.otherField
                createEntity = (other.otherField === undefined || other.otherField) ? false : true;
                console.log("");

            } while (repeat);

            if(createEntity){
                let pathTemplate = path.join(__dirname, '../../../templates/entitySwagger.txt')

                console.log("fields :", fields);

                fs.readFile(pathTemplate, 'utf-8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }

                    required = fields.filter(field => field.required);

                    let modifiedData:string = '';

                    modifiedData = data.replace(/<Entity>/g, validate.capitalizeFirstLetter(validate.toCamelCase(entity.name)));

                    let fieldBody:string = '{\n';
                    let fieldRequired:string = '[';

                    let ultimateField:number = fields.length;
                    let i:number = 0;
                    fields.forEach(field => {
                        // Replace <body>
                        if(i < ultimateField - 1){
                            fieldBody += `\t\t\t${validate.toCamelCase(field.name)} : { type: '${field.type}' },\n`;
                        }else{
                            fieldBody += `\t\t\t${validate.toCamelCase(field.name)} : { type: '${field.type}' }\n`;
                        }
                        i = i+1;
                    });

                    i = 0;
                    ultimateField = required.length;
                    required.forEach(field => {
                        if(i < ultimateField - 1){
                            if(field.required) fieldRequired += `'${validate.toCamelCase(field.name)}',`;
                        }else{
                            if(field.required) fieldRequired += `'${validate.toCamelCase(field.name)}'`;
                        }
                        i = i+1;
                    });

                    fieldBody += '\t\t};';
                    fieldRequired += '];';

                    modifiedData = modifiedData.replace(/<body>/g, fieldBody);
                    modifiedData = modifiedData.replace(/<required>/g, fieldRequired);

                    // Path to save the file as .ts
                    let nameFile = validate.toCamelCase(entity.name);

                    const newFilePath = path.join(__dirname, `../../../../src/app/swagger/${nameFile}.swagger.ts`);

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
