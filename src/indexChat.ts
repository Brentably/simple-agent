#!/usr/bin/env node

import { Command } from "commander";
import chat from "./chat";
import fs from 'fs'
import path from 'path'
import { clearChat } from "./state";
import writeFileWithPrompt from "./writeFromPrompt";
import ask from "./ask";


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
  .action(() => clearChat())

//   program
//   .command('write <filePath> [prompt...]')
//   .alias('w')
//   .option("-4, --four", 'gpt-4')
//   .description('write or modify a file given a path and prompt.')
//   .action(async (filePath, promptParts, cmdObj) => {
//     const prompt = promptParts.join(' ')
//     await writeFileWithPrompt(filePath, prompt, cmdObj.four ? "gpt-4" : "gpt-3.5-turbo");
//   });

// program
//   .command('ask <filePath> [prompt...]')
//   .alias('a')
//   .option("-4, --four", 'gpt-4')
//   .description('ask a question about a file, it will automatically pull in a file as context')
//   .action(async (filePath, promptParts, cmdObj) => {
//     const prompt = promptParts.join(' ')
//     await ask(filePath, prompt, cmdObj.four ? "gpt-4" : "gpt-3.5-turbo");
//   });

  
program.parseAsync(process.argv)