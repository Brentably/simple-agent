import readline from 'readline'
import { calcTokens, calculateExpense, contextLength, getOpenAI } from '../openai';
import { highlightCode } from '../utils/highlight';
import chalk from 'chalk'
import { readStore, trimMessages, writeStore } from '../state';
import { makeSystemString, parseAction } from './helpers';


async function Ask(question: string) {
  console.log(`|Agent's Question: ${question}`)
  const answer = await getUserInput("|Answer: ")
  return answer
}


// we use camelcase for the choices because I think theres a higher probability the LLM parses it correctly
const choicesToFunctions: {[key:string]: Function} = {
  "ask_question": Ask,
}

const possibleChoices = [...Object.keys(choicesToFunctions), 'finish']


/* 
there are a many different ways you could set this up, and I'm not sure which would produce the most optimal results. 
Do you have a plan? Do you call them tools or actions or choices? What about the syntax of functions? 
Does observation return a response in natural language?
*/




const systemStringTemplate = 
`${''/*`You are the internal Monologue of a Chat Assistant.`*/}
You run in a loop of Thought, Action, Result.
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run a function available to you
Result will be the result of running these functions.

functions:
ask_question(question: string)
finish(response: string)

Rules:
- If you have received an Input from the user, you should reply with a Thought and an Action.
- If you have received an Observation, you should reply with a Thought and an Action.
- You should never reply with an Input or Result.

Examples: 

  Input: What is my name?
  Thought: I don't have access to the user's name. I need to ask for it.
  Action: ask_question("What is your name?")
  Result: Brent
  Thought: The users name is Brent
  Action: finish("Brent")


  Input: hey
  Thought: The user has greeted me. I should respond with a greeting as well.
  Action: ask_question("Hello! How can I assist you today?")
  Result: Write a simple function for me
  Thought: The user wants me to write a function. I need to ask for more details about the function.
  Action: ask_question("Sure! What should the function do? Can you provide more details?")
  Result: Yeah, it should just be a javascript function called hello that returns "world"
  Thought: The user wants a simple JavaScript function that returns true. I can create a function that does that.
  Action: finish(
  \`\`\`
  const hello = () => {
    return "world"
  };
  \`\`\` 
  )


Remember: Prefix your outputs with Thought or Action to signify what you're doing.
Let me reiterate: Always invoke a function as part of your output. 
`

const systemString = makeSystemString(systemStringTemplate, possibleChoices)


export default async function expirimentalChat(model = "gpt-3.5-turbo") {
  console.log('\x1b[1m%s\x1b[0m', `Experimental Chat >:D`);
  console.log(` Model: ${chalk.green(model)} \n`)
  const prevMessages = Boolean(readStore().dialogues.experimentalChat.messagesHistory.length)
    if(!prevMessages || true) { //initiate thing
      writeStore(ps => {
        ps.dialogues.experimentalChat.messagesHistory = [{role: "system", content: systemString}]
        ps.dialogues.experimentalChat.historyTokens = calcTokens(systemString).toString()
        return ps
      })
    }
    console.log(systemString)

    while(true) {
      const value = await getUserInput(chalk.red(">>> "))
      await agentCycle(value)
      
      
    }
}



async function agentCycle(inputString: string, model = "gpt-3.5-turbo", temperature: number = 0, dialogue = "experimentalChat") {
  const openai = await getOpenAI()
  if(parseInt(readStore().dialogues[dialogue].historyTokens) + calcTokens(inputString) > contextLength[model]) trimMessages({dialogue}) // keeps it within context length
  
  const {messagesHistory: messages, historyTokens} = readStore().dialogues[dialogue]
  messages.push({role: "user", content: `Input: ${inputString}`})

  console.log(`Input: ${inputString}`)

  while(true) {
  
  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
    temperature,
    stop: '\nResult'
    // max_tokens: 200
  });
  if(!completion.data.choices[0].message) throw new Error("something fucked up")
  messages.push(completion.data.choices[0].message)

  const respMessage = completion.data.choices[0].message.content
  console.log(respMessage)
  const [choice, arg] = parseAction(respMessage)
  
  if(choice.toLowerCase() == "finish") {
    console.log(`Output: ${arg}`)
    break
  }

  const functionToCall = choicesToFunctions[choice]

  const observation = await functionToCall(arg)
  messages.push({role: "user", content: `Result: ${observation}`})
  console.log(`Result: ${observation}`)

  //calc usage and update store
  const {prompt_tokens, completion_tokens} = completion.data.usage!
  const expense = calculateExpense(prompt_tokens, completion_tokens, model)
    writeStore((ps) => {
      ps.dialogues[dialogue].messagesHistory = messages
      ps.dialogues[dialogue].historyTokens = `${prompt_tokens+completion_tokens}`
      ps.totalExpense = `${(parseFloat(parseFloat(ps.totalExpense).toFixed(6)) + expense).toFixed(6)}`
      return ps
    });
  }

}



export async function getUserInput(prefix: string):Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer:string = await new Promise((resolve) => {
    rl.question(prefix, (input) => {
      resolve(input);
      rl.close();
    });
  });

  return answer
}

