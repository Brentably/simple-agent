import inquirer from 'inquirer'

export default async function getApiKey() {
  if(process.env.OPENAI_KEY) return;
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: "Please enter your OpenAI API Key:",
    },
  ]);
  process.env.OPENAI_KEY = answers.apiKey
  console.log('success')
}