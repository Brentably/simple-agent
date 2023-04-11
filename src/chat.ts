import readline from 'readline'
import { getChatCompletion } from './openai';
import { highlightCode } from './utils/highlight';
import chalk from 'chalk'

export default async function chat(model = "gpt-3.5-turbo") {
  console.log('\x1b[1m%s\x1b[0m', `Chat GPT CLI.`);
  console.log(` Model: ${chalk.green(model)} \n`)
    while(true) {
      const value = await getUserInput(chalk.greenBright(">>> "))
    const resp = await getChatCompletion(value)

    console.log("\n" + highlightCode(resp) + "\n")
    }
}


export async function getUserInput(prefix: string):Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer:string = await new Promise((resolve) => {
    rl.question(prefix, (input) => {
      resolve(input);
      rl.close();
    });
  });

  return answer
}

