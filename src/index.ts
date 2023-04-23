#!/usr/bin/env node
import { Command } from 'commander'
import inquirer from 'inquirer'
import { clearChat } from './state';
import fs from 'fs';
import path from 'path'
import agentChat from './agent/agentChat';

const program = new Command()

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
const { version, description } = packageJson;


program.version(version).description(description);

program
  .command('agent')
  .description('chat with chatGPT agent')
  .action(() => agentChat())

program
  .command('clear')
  .action(() => clearChat())

program.parseAsync(process.argv)