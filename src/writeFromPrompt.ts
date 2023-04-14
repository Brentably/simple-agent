import { getChatCompletion, getChatCompletionStandalone } from './openai';
import fs from 'fs';
import chalk from 'chalk'

function readFile(filePath: string) {
  try {
    const data = fs.readFileSync(`${filePath}`, 'utf-8');
    console.log(data);
    return data;
  } catch (err) {
    return `[FILE_EMPTY]`;
  }
}


export default async function writeFileWithPrompt(filePath: string, userPrompt: string, model:string = "gpt-3.5-turbo") {
  console.log(`file path: ${chalk.green(filePath)}\n userPrompt: ${userPrompt}`);
  
  const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''

  const prompt = `
  Your job is to modify a code file given a prompt. Sometimes the file will be empty. Create the file from scratch if that is the case.
  Respond with only the modified or created file. You do not need to explain or say anything else. ${fileContent ? `Keep the file as similar as possible and only change what is asked in the prompt.` : null}
  
  
  ${fileContent ? `Here is the complete file: \`\`\`\n${fileContent}\n\`\`\`` : null}
  
  prompt: "${userPrompt}"
  `


  // if there's a codeblock, return codeblock, otherwise, wrap chatgpts response in a backtick delimiter
  const res = await getChatCompletion(prompt, model, 0).then((string) => string.match(/```([\s\S]*?)```/g) ? string : `\`\`\`\n${string}\n\`\`\`` ) 
  
  console.log(`Openai res: \n${res}`);

  const pattern = /```(?:[a-z]+)?\n([\s\S]*?)\n```/g;
    // const regex = new RegExp(/```([\s\S]*?)```/g)
  
  let contentToInsert = '';
  let match;
  while ((match = pattern.exec(res)) !== null) {
    const codeBlock = match[1];
    contentToInsert += codeBlock;
  }

  fs.writeFile(filePath, contentToInsert, (err) => {
    if (err) throw err;
    console.log(`Data written to ${filePath}`);
  });
  
}
