import { Command } from 'commander';
import prompts from 'prompts';
import Validate from '../../core/prompts/validate';
import * as fs from 'fs';
import * as path from 'path';
import { writeFile } from 'fs-extra';
import { promisify } from 'util';

export default (program: Command) => {
    program
        .command('crud:create')
        .description('Create crud')
        .action(async () => {
            const validate = new Validate();

            const version = await prompts({
                type: 'select',
                name: 'name',
                message: 'Choose the version of your route?',
                choices: await getVersionRoute()
            });

            if (version.name != 'none' && version.name != 'undefined') {
                const interfaceEntity = await prompts({
                    type: 'text',
                    name: 'name',
                    message: 'Enter name interface',
                    validate: (value) => validate.existInterface(value),
                });

                const model = await prompts({
                    type: 'text',
                    name: 'name',
                    message: 'Enter name modal',
                    validate: (value) => validate.existModel(value),
                });

                const controller = await prompts({
                    type: 'text',
                    name: 'name',
                    message: 'Enter name controller',
                    validate: (value) => validate.existController(value),
                });

                const swagger = await prompts({
                    type: 'text',
                    name: 'name',
                    message: 'Enter name swagger',
                    validate: (value) => validate.existSwagger(value),
                });

                const pathProject = process.cwd();
                createInterface(interfaceEntity.name, pathProject);
                createModel(model.name, interfaceEntity.name, pathProject);
                createController(controller.name, model.name, interfaceEntity.name, pathProject);
                createRoute(model.name, controller.name, swagger.name, version.name, pathProject);
                modifyRouteFile(version.name, controller.name, model.name, pathProject);
            } else {
                console.error('Your system does not have this version');
            }


        });
}

async function createInterface(name: string, pathProject: string) {
    const interfaceTemplate = path.join(pathProject, '/emily/templates/interface.txt');
    const validate: Validate = new Validate();
    fs.readFile(interfaceTemplate, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return false;
        }

        let nameFile = validate.toCamelCase(name);

        let newFilePath = path.join(pathProject, `/src/app/interfaces/${nameFile}.interface.ts`);

        await writeFileAsync(newFilePath, data);
    });
}

async function createModel(name: string, nameInterface: string, pathProject: string,) {
    const modelTemplate = path.join(pathProject, '/emily/templates/model.txt');
    const validate: Validate = new Validate();
    fs.readFile(modelTemplate, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return false;
        }

        let modifiedData: string = '';
        modifiedData = data.replace(/<NameInterface>/g, validate.capitalizeFirstLetter(validate.toCamelCase(nameInterface)));
        modifiedData = modifiedData.replace(/<nameInterface>/g, validate.toCamelCase(nameInterface));
        modifiedData = modifiedData.replace(/<NameModel>/g, validate.capitalizeFirstLetter(validate.toCamelCase(name)));

        let nameT = validate.toCamelCase(name);

        modifiedData = modifiedData.replace(/<TableName>/g, nameT);

        let nameFile = validate.toCamelCase(name);
        let newFilePath = path.join(pathProject, `/src/app/models/${nameFile}.model.ts`);

        await writeFileAsync(newFilePath, modifiedData);
    });
}

async function createController(name: string, model: string, nameInterface: string, pathProject: string) {
    const controllerTemplate = path.join(pathProject, '/emily/templates/controller.txt');
    const validate: Validate = new Validate();
    fs.readFile(controllerTemplate, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return false;
        }

        let modifiedData: string = '';
        modifiedData = data.replace(/<NameInterface>/g, validate.capitalizeFirstLetter(validate.toCamelCase(nameInterface)));
        modifiedData = modifiedData.replace(/<nameInterface>/g, validate.toCamelCase(nameInterface));
        modifiedData = modifiedData.replace(/<NameModel>/g, validate.capitalizeFirstLetter(validate.toCamelCase(model)));
        modifiedData = modifiedData.replace(/<nameModel>/g, validate.toCamelCase(model));
        modifiedData = modifiedData.replace(/<NameController>/g, validate.capitalizeFirstLetter(validate.toCamelCase(name)));

        let nameFile = validate.toCamelCase(name);
        let newFilePath = path.join(pathProject, `/src/app/controllers/${nameFile}.controller.ts`);

        await writeFileAsync(newFilePath, modifiedData);
    });
}

async function createRoute(model: string, controller: string, swagger: string, version: string, pathProject: string) {
    const routeTemplate = path.join(pathProject, '/emily/templates/route.txt');
    const validate: Validate = new Validate();
    fs.readFile(routeTemplate, 'utf-8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return false;
        }

        let modifiedData: string = '';
        modifiedData = data.replace(/<Controller>/g, validate.capitalizeFirstLetter(validate.toCamelCase(controller)));
        modifiedData = modifiedData.replace(/<controller>/g, validate.toCamelCase(controller));
        modifiedData = modifiedData.replace(/<Swagger>/g, validate.capitalizeFirstLetter(validate.toCamelCase(swagger)));
        modifiedData = modifiedData.replace(/<swagger>/g, validate.toCamelCase(swagger));
        modifiedData = modifiedData.replace(/<Model>/g, validate.capitalizeFirstLetter(validate.toCamelCase(model)));
        modifiedData = modifiedData.replace(/<model>/g, validate.toCamelCase(model));

        let nameRoute = controller;
        modifiedData = modifiedData.replace(/<nameRoute>/g, validate.capitalizeFirstLetter(validate.toCamelCase(nameRoute)));

        let nameFile = validate.toCamelCase(nameRoute);

        let newFilePath = path.join(pathProject, `/src/app/routes/${version}/routes/${nameFile}.routes.ts`);

        await writeFileAsync(newFilePath, modifiedData);
    });
}

async function writeFileAsync(newFilePath: string, modifiedData: string) {
    // Save the modified file as a TypeScript file
    fs.writeFile(newFilePath, modifiedData, 'utf-8', (err) => {
        if (err) {
            console.error(`Error save file ${newFilePath}`, err);
            return false;
        } else {
            console.log(`Save file successfully ${newFilePath}`);
            return true;
        }
    });
}

async function getVersionRoute() {
    try {
        const path = process.cwd() + '/src/app/routes';
        let folders = await listDirectoryNames(path);
        let arrayFolders: { title: string, value: string }[] = [];
        folders.forEach(v => {
            arrayFolders.push({ title: `${v}`, value: `${v}` })
        });

        return arrayFolders;
    } catch (error) {
        return [
            { title: 'None', value: 'none' }
        ]
    }
}

async function listDirectoryNames(targetPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(targetPath, { withFileTypes: true }, (err, entries) => {
            if (err) {
                console.error(`Error reading directory ${targetPath}:`, err);
                return reject(err);
            }

            const directoryNames: string[] = [];
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    directoryNames.push(entry.name);
                }
            }
            resolve(directoryNames);
        });
    });
}

async function modifyRouteFile(version:string, nameRoute:string, prefix:string, filePath:string):Promise<void> {
    const readFileAsync = promisify(fs.readFile);
    const writeFileAsync = promisify(fs.writeFile);

    let routePath:string = `${filePath}/src/app/routes/${version}/index.routes.ts`;

    try {
      // Leer el contenido del archivo
      const data = await readFileAsync(routePath, 'utf-8');
      const lines = data.split('\n');
      let validate = new Validate();
      let name = validate.toCamelCase(nameRoute);
      let routeLine = `\tawait route.register(${name}Routes, { prefix: '${prefix}' } );\n`;
      let importLine = `\nimport ${name}Routes from './routes/${name}.routes';`;
        `
        `
      if (lines.length > 2) {

          const antepenultimateLine = lines.length - 3;
          const secondLine = 1;

          lines[antepenultimateLine] = routeLine;
          lines[secondLine] = importLine;
      
          const modifiedContent = lines.join('\n');
      
          await writeFileAsync(routePath, modifiedContent, 'utf-8');
      }
  
    } catch (error) {
      console.error(`Error the update file: ${routePath}:`, error);
      throw error;
    }
  }