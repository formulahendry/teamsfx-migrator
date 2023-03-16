#!/usr/bin/env node

const { program } = require('commander');
const { migrate } = require('./migrate');
const packageJson = require('./package.json');

program
  .description('CLI to migrate samples to TeamsFX V3')
  .version(packageJson.version);

program.command('migrate')
  .description('Migrate project in current folder to TeamsFX V3')
  .option('-n, --name <type>', 'app name')
  .option('-t, --type <type>', 'app type')
  .action(async (options) => {
    console.log(options);
    await migrate(options.name, options.type)
  });

program.parse();