#!/usr/bin/env node
import {Command} from 'commander';
import getApiKey from './getApiKey';
import inquirer from 'inquirer';

const program = new Command();



program
  .version('0.0.1') 
  .description('My CLI tool');

  
  program.action(async () => {

    // Prompt the user for input using inquirer
    // if(!process.env.OPENAI_KEY) await getApiKey()
    console.log("fuck mayne")
    await getApiKey()
  });
  

  

// program
  // .command('my-command')
  // .description('A sample command')

program.parse(process.argv);
