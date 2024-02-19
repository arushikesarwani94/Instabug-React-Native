#!/usr/bin/env node
import { Command } from 'commander';

import { uploadSourcemapsCommand } from './UploadSourcemaps';
import { UploadSoFilesCommand } from './UploadSoFiles';

const program = new Command();

program
  .name('instabug')
  .version('1.0.0-beta1')
  .description('A CLI for uploading source maps to Instabug dashboard.')
  .usage('[command]')
  .addCommand(uploadSourcemapsCommand)
  .addCommand(UploadSoFilesCommand);

program.parse(process.argv);
