import { ChatCompletionRequestMessage, Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import {readApiKey, readStore, writeStore} from "./state"
import getApiKey from "./getApiKey";

const PRICING_RATE:{[key:string]:any} = {
  "gpt-3.5-turbo": {"prompt": 0.002, "completion": 0.002},
  "gpt-4": {"prompt": 0.03, "completion": 0.06},
  "gpt-4-32k": {"prompt": 0.06, "completion": 0.12},
}

function calculateExpense(prompt_tokens: number, completion_tokens: number, model: string) {
  const {prompt: prompt_pricing, completion: completion_pricing} = PRICING_RATE[model]
  return ((prompt_tokens / 1000) * prompt_pricing) + ((completion_tokens / 1000) * completion_pricing)
}
//helper
async function getOpenAI() {
  const configuration = new Configuration({
      apiKey: readApiKey(),
  });

  return new OpenAIApi(configuration);
}

// calls openai, stores the message history in store.json
export async function getChatCompletion(message: string, model = "gpt-3.5-turbo", temperature?: number) {
  const openai = await getOpenAI()
  const messages:ChatCompletionRequestMessage[] = readStore().messagesHistory
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
  console.log(expense)
  writeStore((ps) => ({...ps, messagesHistory: messages}));
  return completion.data.choices[0].message.content
}


// calls openai, stores the message history in store.json
export async function getChatCompletionStandalone(message: string, model = "gpt-3.5-turbo", temperature = 0) {
  const openai = await getOpenAI()
  const messages = [{role: ChatCompletionRequestMessageRoleEnum.User, content: message}];
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature: temperature
  });

  if(!completion.data.choices[0].message) throw new Error("something fucked up")

  return completion.data.choices[0].message.content
}

// async function test() {
//   console.log(await getChatCompletion('Hello'))
//   console.log(readStore())
// }
// test()
