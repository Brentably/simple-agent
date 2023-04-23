

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
