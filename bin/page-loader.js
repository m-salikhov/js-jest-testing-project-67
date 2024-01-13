#!/usr/bin/env node

import { program } from 'commander';
import run from '../src/index.js';

program.option('-o, --output <char>', 'folder for saved html').argument('<url>');
program.parse(process.argv);

const output = program.getOptionValue('output');
const url = program.processedArgs[0];

run(url, output);
