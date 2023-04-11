#!/usr/bin/env node
import { Command } from 'commander'
import getApiKey from './getApiKey'
import writeFileWithPrompt from './writeToFileWithPrompt'
import inquirer from 'inquirer'
import {clearChat} from './state';
import chat, { getUserInput } from './chat';
const program = new Command()


program.version('0.0.1').description('My CLI tool')

// Checks for OpenAI key and prompts user if it's not in the .env
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
  .alias('-w')
  .description('write or modify a file given a path and prompt.')
  .action(async ( filePath, promptParts ) => {
    const prompt = promptParts.join(' ')
    const res = await writeFileWithPrompt(filePath, prompt);
    console.log(res);
  });

  

program.parseAsync(process.argv)
