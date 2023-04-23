/*
const systemStringTemplate = 
`You are the internal Monologue of a Chat Assistant. 
You run in a loop of Thought, Action, Observation.
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run one of the actions available to you - 
Observation will be the result of running those actions.

Choices:
{{possibleChoices}}

Rules:
- If you have received an Input from the user, you should reply with a Thought and an Action.
- If you have received an Observation from a tool, you should reply with a Thought and an Action.
- You should never reply with an Input.
Input = `
*/


export const makeSystemString = (systemStringTemplate: string, possibleChoices: string[]) => {
  console.log(possibleChoices)
  const formattedToolsString = possibleChoices.join('\n')
  console.log(formattedToolsString)
  const systemString = systemStringTemplate.replace('{{possibleChoices}}', formattedToolsString)
  return systemString
}

function parseActionHelper(argArr: string[]): string[] {
  const args = []
  let isArg = false
  let current = ''
  let startAndEndChar = null
  for(let char of argArr) {
    if(char.length > 1) throw new Error('not char')
    if(isArg == false && (char === `"` || char == `'`)) {
      startAndEndChar = char
      isArg = true
      continue
    }
    if(isArg) {
      if(char === startAndEndChar) {
        args.push(current)
        current = ''
        isArg = false
        continue
      }
      current += char
    }
  }
  return args
}

// just one arg right now
export const parseAction = (message: string): [string, string[]] => {
  const messageArr = message.split("\n"); //split by spaces or linebreak
  const actionIndex = messageArr.findIndex(el => el.toLowerCase().startsWith('action:'))
  if(actionIndex === -1) throw new Error("parseActionAndArg() failed")
  if(messageArr[actionIndex+1] && messageArr[actionIndex+1].startsWith('```') && messageArr[messageArr.length-1].endsWith('```')) {
    return ["run_code", [messageArr.slice(actionIndex+2, messageArr.length-2).join('\n')]]
  }
  const justAction = messageArr.slice(actionIndex).join('\n').split(' ').slice(1).join(' ')
  console.log('justAction', justAction)
  const choice = justAction.split('(')[0]
  const actionArr = justAction.split('')
  const firstParenthIndex = actionArr.findIndex(el => el === '(')
  const lastParenthIndex = actionArr.findLastIndex(el => el === ")")
  const argArr = actionArr.slice(firstParenthIndex +1, lastParenthIndex)
  const args = parseActionHelper(argArr)
  /*.split(',').map(arg => arg.trim()).map(arg =>  ((arg.startsWith(`"`) && arg.endsWith(`"`)) ? arg.slice(1, -1) : arg).replace(/\\n/g, '\n'))*/

  return [choice, args]
}
