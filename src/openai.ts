import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import {readApiKey, readStore, trimMessages, writeApiKey, writeStore} from "./state"
import inquirer from "inquirer";


const PRICING_RATE:{[key:string]:any} = {
  "gpt-3.5-turbo": {"prompt": 0.002, "completion": 0.002},
  "gpt-4": {"prompt": 0.03, "completion": 0.06},
  "gpt-4-32k": {"prompt": 0.06, "completion": 0.12},
}
const contextLength:{[key:string]:number} = {
  "gpt-3.5-turbo": 4050, // 4097 Exactly but method of calculating tokens is a little rough
  "gpt-4": 8192
}


function calculateExpense(prompt_tokens: number, completion_tokens: number, model: string) {
  const {prompt: prompt_pricing, completion: completion_pricing} = PRICING_RATE[model]
  return parseFloat(((prompt_tokens / 1000) * prompt_pricing) + ((completion_tokens / 1000) * completion_pricing).toFixed(6))
}
//helper
async function getOpenAI() {
  await getApiKey()
  const configuration = new Configuration({
      apiKey: readApiKey(),
  });

  return new OpenAIApi(configuration);
}

// calls openai, stores the message history in store.json
export async function getChatCompletion(message: string, model = "gpt-3.5-turbo", temperature?: number) {
  const openai = await getOpenAI()
  if(parseInt(readStore().historyTokens) + calcTokens(message) > contextLength[model]) trimMessages() // keeps it within context length
  
  const {messagesHistory: messages, historyTokens} = readStore()
  messages.push({role: "user", content: message})




  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature
  });

  if(!completion.data.choices[0].message) throw new Error("something fucked up")
  messages.push(completion.data.choices[0].message)
  const {prompt_tokens, completion_tokens} = completion.data.usage!
  const expense = calculateExpense(prompt_tokens, completion_tokens, model)
  // the weird syntax is just necessary for rounding to 6 decimal places lol
  writeStore((ps) => ({...ps, historyTokens: `${prompt_tokens+completion_tokens}`, totalExpense:`${(parseFloat(parseFloat(ps.totalExpense).toFixed(6)) + expense).toFixed(6)}`, messagesHistory: messages, }));
  return completion.data.choices[0].message.content
}


// calls openai, stores the message history in store.json
export async function getChatCompletionStandalone(message: string, model = "gpt-3.5-turbo", temperature = 0) {
  const openai = await getOpenAI()
  const messages = [{role: ChatCompletionRequestMessageRoleEnum.User, content: message}];
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature
  });

  if(!completion.data.choices[0].message) throw new Error("something fucked up")

  return completion.data.choices[0].message.content
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