#!/usr/bin/env node

import { program } from 'commander';
import run from '../src/index.js';
import chalk from 'chalk';

program
  .description('Download and save html')
  .option('-o, --output <char>', 'directory for save html')
  .version('0.0.1', '-v, -V, --version', 'output the current version')
  .argument('<url>')
  .action(async (url, option) => {
    const output = option.output ? option.output : null;

    const { filepath } = await run(url, output);

    console.log(chalk.green('Page saved: ' + filepath));
  });

program.parse(process.argv);
