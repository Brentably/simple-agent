import readline from 'readline'
import { getChatCompletion } from './openai';
export default async function chat() {
    while(true) {
      const value = await getUserInput(">>> ")
    const resp = await getChatCompletion(value)
    console.log(resp)
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
