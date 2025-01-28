import { Command } from 'commander';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const program = new Command();

// Function by load commands recurrent
const loadCommands = (dir: string): void => {
  const files = readdirSync(dir);

  for (const file of files) {
    const fullPath = join(dir, file);

    if (statSync(fullPath).isDirectory()) {
      // if to directory, load commands
      loadCommands(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      // Import and register commands
      const command = require(fullPath).default;
      if (command && typeof command === 'function') {
        command(program);
      }
    }
  }
};

// Load commands from folder 'commands'
loadCommands(join(__dirname, 'commands'));

// Process the arguments
program.parse(process.argv);
