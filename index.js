#!/usr/bin/env node

const { program, Option } = require('commander');
const { AppTypes } = require('./constant');
const { migrate } = require('./migrate');
const packageJson = require('./package.json');

program
  .description('CLI to migrate samples to TeamsFX V3')
  .version(packageJson.version);

program.command('migrate')
  .description('Migrate project in current folder to TeamsFX V3')
  .requiredOption('-n, --name <type>', 'app name')
  .addOption(new Option('-t, --type <type>', 'app type')
    .makeOptionMandatory()
    .choices(Object.values(AppTypes)))
  .action(async (options) => {
    console.log(options);
    await migrate(options.name, options.type)
  });

program.parse();