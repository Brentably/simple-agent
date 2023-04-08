import { Configuration, OpenAIApi } from "openai";
import {readApiKey, readStore} from "./state"

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
function getOpenAI() {
  const configuration = new Configuration({
      apiKey: readApiKey(),
  });

  return new OpenAIApi(configuration);
}

export async function getChatCompletion(message: string) {
  const openai = getOpenAI()
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: message}],
  });

  return completion.data.choices[0].message?.content
}

async function test() {
  console.log(await getChatCompletion('Im trying to build a next.js project. Please give me an example starter'))
  console.log(readStore())
}
test()