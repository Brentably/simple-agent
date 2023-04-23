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

// just one arg right now
export const parseAction = (message: string): [string, string] => {
  const messageArr = message.split("\n"); //split by spaces or linebreak
  const actionIndex = messageArr.findIndex(el => el.toLowerCase().startsWith('action:'))
  if(actionIndex === -1) throw new Error("parseActionAndArg() failed")
  const justAction = messageArr.slice(actionIndex).join('\n').split(' ').slice(1).join(' ')
  const choice = justAction.split('(')[0]
  const actionArr = justAction.split('')
  const firstParenthIndex = actionArr.findIndex(el => el === '(')
  const lastParenthIndex = actionArr.findLastIndex(el => el === ")")
  const argArr = actionArr.slice(firstParenthIndex +1, lastParenthIndex)
  const arg = argArr.join('')
  return [choice, arg]
}
