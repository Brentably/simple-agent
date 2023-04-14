#!/usr/bin/env node
import { Command } from 'commander'
import writeFileWithPrompt from './writeFromPrompt'
import inquirer from 'inquirer'
import { clearChat } from './state';
import chat, { getUserInput } from './chat';
import ask from './ask';
import fs from 'fs';
import path from 'path'

const program = new Command()

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
const { version, description } = packageJson;

program.version(version).description(description);

program
  .command('chat')
  .description('chat with chatGPT!')
  .action(() => chat())

program
  .command('clear')
  .description('clear the chat history')
  .action(clearChat)

program
  .command('write <filePath> [prompt...]')
  .alias('w')
  .option("-4, --four", 'gpt-4')
  .description('write or modify a file given a path and prompt.')
  .action(async (filePath, promptParts, cmdObj) => {
    const prompt = promptParts.join(' ')
    await writeFileWithPrompt(filePath, prompt, cmdObj.four ? "gpt-4" : "gpt-3.5-turbo");
  });

program
  .command('ask <filePath> [prompt...]')
  .alias('a')
  .option("-4, --four", 'gpt-4')
  .description('ask a question about a file, it will automatically pull in a file as context')
  .action(async (filePath, promptParts, cmdObj) => {
    const prompt = promptParts.join(' ')
    await ask(filePath, prompt, cmdObj.four ? "gpt-4" : "gpt-3.5-turbo");
  });

program.parseAsync(process.argv)