#!/usr/bin/env node
import { Command } from 'commander'
import getApiKey from './getApiKey'
import writeFileWithPrompt from './writeFromPrompt'
import inquirer from 'inquirer'
import { clearChat } from './state';
import chat, { getUserInput } from './chat';

const program = new Command()

program.version('0.0.1').description('My CLI tool')

program.action(async () => {
  await getApiKey()
})

program.action(async () => {
  chat()
})

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

program.parseAsync(process.argv)