#!/usr/bin/env node

import { Command } from "commander";
import chat from "./chat";
import fs from 'fs'
import path from 'path'
import { clearChat } from "./state";


const program = new Command()

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
const { version, description } = packageJson;

program.version(version).description('chat with chatGPT!')

program
  .option("-4, --four", 'gpt-4')
  .action((options) => chat(options.four ? "gpt-4" : undefined))


program
  .command('clear')
  .description('clear the chat history')
  .action(clearChat)

  
program.parseAsync(process.argv)