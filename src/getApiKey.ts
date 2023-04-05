import inquirer from 'inquirer'
import { readApiKey, writeApiKey } from './utils/state';


export default async function getApiKey() {
  if(readApiKey()) return;
  const answers = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Please enter your OpenAI API Key:",
      mask: '*'
    },
  ]);
  writeApiKey(answers.apiKey)
  console.log('success')
  console.log(readApiKey())
}