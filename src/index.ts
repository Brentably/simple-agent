#!/usr/bin/env node
import { Command } from 'commander'
import writeFileWithPrompt from './writeFromPrompt'
import inquirer from 'inquirer'
import { clearChat } from './state';
import chat, { getUserInput } from './chat';
import ask from './ask';
import fs from 'fs';

const program = new Command()

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
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
  .description('write or modify a file given a path and prompt.')
  .action(async (filePath, promptParts) => {
    const prompt = promptParts.join(' ')
    await writeFileWithPrompt(filePath, prompt);
  });

program
  .command('ask <filePath> [prompt...]')
  .alias('a')
  .description('ask a question about a file, it will automatically pull in a file as context')
  .action(async (filePath, promptParts) => {
    const prompt = promptParts.join(' ')
    await ask(filePath, prompt);
  });

program.parseAsync(process.argv)