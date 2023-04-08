import {print} from './state';
import { getChatCompletion } from './openai';
import fs from 'fs';

function readFile(filePath: String) {
  try {
    const data = fs.readFileSync(`${filePath}`, 'utf-8');
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default async function writeFileWithPrompt(filePath: String, prompt: String) {
  print(`file path: ${filePath}\nprompt: ${prompt}`);
  const fileContent = readFile(filePath);
  const res = await getChatCompletion(
`
Rewrite this file using the given prompt, and using the given content. Just respond with what the whole file should look like, in one blob denotated by backticks.

file_path: "${filePath}",
file_content: "${fileContent}",
prompt: "${prompt}"
`);
  
  return `Openai res: ${res}`;
}