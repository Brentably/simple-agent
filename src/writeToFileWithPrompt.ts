import { getChatCompletion, getChatCompletionStandalone } from './openai';
import fs from 'fs';

function readFile(filePath: string) {
  try {
    const data = fs.readFileSync(`${filePath}`, 'utf-8');
    console.log(data);
    return data;
  } catch (err) {
    return `[FILE_EMPTY]`;
  }
}


export default async function writeFileWithPrompt(filePath: string, userPrompt: string) {
  console.log(`file path: ${filePath}\n userPrompt: ${userPrompt}`);
  
  const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''

  const prompt = `
  Your job is to modify a code file given a prompt. Sometimes the file will be empty. Create the file from scratch if that is the case.
  Respond with only the modified or created file. You do not need to explain or say anything else. Keep the file as similar as possible and only change what is asked in the prompt.
  
  
  ${fileContent ? `Here is the complete file: \`\`\`\n${fileContent}\n\`\`\`` : null}
  
  prompt: "${userPrompt}"
  `
  

  const res = await getChatCompletionStandalone(prompt);
  
  console.log(`Openai res: ${res}`);

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
