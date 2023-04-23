import { Configuration, OpenAIApi } from "openai";
import {readApiKey, writeApiKey} from "./state"
import inquirer from "inquirer";


export const PRICING_RATE:{[key:string]:any} = {
  "gpt-3.5-turbo": {"prompt": 0.002, "completion": 0.002},
  "gpt-4": {"prompt": 0.03, "completion": 0.06},
  "gpt-4-32k": {"prompt": 0.06, "completion": 0.12},
}
export const contextLength:{[key:string]:number} = {
  "gpt-3.5-turbo": 4050, // 4097 Exactly but method of calculating tokens is a little rough
  "gpt-4": 8192
}


export function calculateExpense(prompt_tokens: number, completion_tokens: number, model: string) {
  const {prompt: prompt_pricing, completion: completion_pricing} = PRICING_RATE[model]
  return parseFloat(((prompt_tokens / 1000) * prompt_pricing) + ((completion_tokens / 1000) * completion_pricing).toFixed(6))
}
//helper
export async function getOpenAI() {
  await getApiKey()
  const configuration = new Configuration({
      apiKey: readApiKey(),
  });

  return new OpenAIApi(configuration);
}



export default async function getApiKey() {
  if(readApiKey()) return true;
  //else
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Please enter your OpenAI API Key:",
        mask: '*'
      },
    ]);

    console.log('verifying key...')
    const validKey = testKey(answers.apiKey)
    if(!validKey) {
      console.log("key is invalid. Please check key and try again")
      return
    }

    console.log('success')
    writeApiKey(answers.apiKey)

}


export async function testKey(key: string):Promise<boolean> {

  const configuration = new Configuration({
      apiKey: key,
  });

  const openai =  new OpenAIApi(configuration);

  const resp = await openai.listModels()
  return resp.status === 200
}


export const calcTokens = (string: string): number => Math.round(string.length / 4)