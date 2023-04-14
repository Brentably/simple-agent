import { getChatCompletion, getChatCompletionStandalone } from './openai';
import fs from 'fs';
import { highlightCode } from './utils/highlight';

const ASK_TEMPERATURE = 0.2

export default async function ask(filePath: string, userPrompt: string, model: string = 'gpt-3.5-turbo') {
  if(!fs.existsSync(filePath)) throw new Error("file does not exist")
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const prompt = `
  Here is my file called ${filePath.split('/')[filePath.split('/').length-1]} 
  \`\`\`
  ${fileContent}
  \`\`\`

  ${userPrompt.trimEnd()}
  `


  // if there's a codeblock, return codeblock, otherwise, wrap chatgpts response in a backtick delimiter
  const res = await getChatCompletion(prompt, model, ASK_TEMPERATURE)
  
  console.log(highlightCode(res))
}
