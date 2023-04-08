#!/usr/bin/env node
import { Command } from 'commander'
import getApiKey from './getApiKey'
import inquirer from 'inquirer'


const program = new Command()

program.version('0.0.1').description('My CLI tool')

program.action(async () => {
  // Prompt the user for input using inquirer
  // if(!process.env.OPENAI_KEY) await getApiKey()
  console.log('f*ck mayne')
  await getApiKey()
})



program
  .command('run')
  .description('Runs the CLI command.')
  .action(async () => {
    const { api_key, file_name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'api_key',
        message: 'Enter your API key:',
      },
      {
        type: 'input',
        name: 'file_name',
        message: 'Enter the file name:',
      },
    ])

    const { prompt } = await inquirer.prompt({
      type: 'input',
      name: 'prompt',
      message: 'Enter a prompt:',
    })

    console.log(`API key: ${api_key}`)
    console.log(`File name: ${file_name}`)
    console.log(`Prompt: ${prompt}`)

    // Do something with the API key and file name, like make an API call
    // and write the response to the specified file.
    // For example:
    // const response = await makeApiCall(api_key, prompt);
    // fs.writeFileSync(file_name, response);
  })

program.parse(process.argv)
