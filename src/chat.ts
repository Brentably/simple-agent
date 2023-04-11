import readline from 'readline'
import { getChatCompletion } from './openai';
import chalk from 'chalk';


export default async function chat(model = "gpt-3.5-turbo") {
  console.log('\x1b[1m%s\x1b[0m', `Chat GPT CLI.`);
  console.log(` Model: ${chalk.green(model)} \n`)
    while(true) {
      const value = await getUserInput(">>> ")
    const resp = await getChatCompletion(value)

    // const codeSnippet = 'function greet(name) {\n  return `Hello, ${name}! orange`;\n}';

    // Define the syntax highlighting styles for each language element
    const styles = {
      keyword: chalk.keyword('orange'),
      string: chalk.green,
      punctuator: chalk.yellow,
      function: chalk.blue,
    };

    // Use a regular expression to match each language element and apply the corresponding style
    const highlightedCode = resp.replace(/(\b\w+\b|[{}()[\],;]|`.*?`)/g, (match) => {
      if (/^\d/.test(match)) {
        return chalk.yellow(match); // highlight numbers with yellow
      }
      for (const [name, color] of Object.entries(styles)) {
        if (new RegExp(`^${name}$`).test(match)) {
          return color.inverse.bold(match); // highlight matching words with an inverse and bold color
        }
      }
      return match;
    });

    // Log the highlighted code to the console
    console.log(highlightedCode)


    // console.log(resp)
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
