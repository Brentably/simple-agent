import { Configuration, OpenAIApi } from "openai";
import {readApiKey, readStore} from "./state"


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