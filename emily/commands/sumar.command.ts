import { Command } from 'commander';
import prompts from 'prompts';

export default (program: Command) => {
  program
    .command('example')
    .description('Un comando interactivo')
    .action(async () => {
      const response = await prompts([
        {
          type: 'text',
          name: 'name',
          message: '¿Cuál es tu nombre?',
        },
        {
          type: 'number',
          name: 'age',
          message: '¿Cuál es tu edad?',
        },
        {
          type: prev => prev > 3 ? 'confirm' : null,
          name: 'confirm',
          message: (prev, values) => `Please confirm that you eat ${values.dish} times ${prev} a day?`
        },
        {
          type: null,
          name: 'forgetme',
          message: `I'll never be shown anyway`,
        },
        {
          type: 'number',
          name: 'only',
          message: 'How old are you?',
          validate: value => value < 18 ? `18+ only` : true
        },
        {
          type: 'number',
          name: 'price',
          message: 'Enter price',
          format: val => Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val)
        }
      ]);

      console.log('Datos ingresados:');
      console.log('confirm:', response.confirm);
      console.log('Nombre:', response.name);
      console.log('Edad:', response.age);
      console.log('Only:', response.only);
    });
};
