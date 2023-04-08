import {print} from './state';
import { getChatCompletion, getChatCompletionStandalone } from './openai';
import fs from 'fs';

function readFile(filePath: String) {
  try {
    const data = fs.readFileSync(`${filePath}`, 'utf-8');
    console.log(data);
    return data;
  } catch (err) {
    return `[FILE_EMPTY]`;
  }
}

export default async function writeFileWithPrompt(filePath: String, prompt: String) {
  print(`file path: ${filePath}\nprompt: ${prompt}`);
  const fileContent = readFile(filePath);
  const res = await getChatCompletionStandalone(
`
Your job is to take a file and a prompt, and spit out what the file should look like given the prompt. Just respond with what the whole file's new content should look like, in one blob denotated by backticks. Make sure you write runnable code.

file name: "${filePath}"

current file content: "${fileContent}"

prompt: "${prompt}"
`, 'gpt-3.5-turbo');
  
  print(`Openai res: ${res}`);

  const pattern = /```(?:[a-z]+)?\n([\s\S]*?)\n```/g;

  let contentToInsert = '';
  let match;
  while ((match = pattern.exec(res)) !== null) {
    const codeBlock = match[1];
    contentToInsert += codeBlock;
  }

  fs.writeFile(`${filePath}`, contentToInsert, (err) => {
    if (err) throw err;
    console.log(`Data written to ${filePath}`);
  });
  
}