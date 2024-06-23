#!/usr/bin/env node

import { program } from 'commander';
import savePage from '../project/code/index.js';
import debugLogger from '../src/utils/debugLog.js';

program
  .description('Download and save html')
  .option('-o, --output <char>', 'directory for save html')
  .version('0.0.1', '-v, -V, --version', 'output the current version')
  .argument('<url>')
  .action(async (url, option) => {
    console.log(option);
    const output = option.output ? option.output : '';

    const { directoryPath } = await savePage(url, output);

    debugLogger('Page was successfully downloaded: %o', directoryPath);
  });

program.parse(process.argv);
