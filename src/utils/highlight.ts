import chalk from 'chalk';
import Prism from 'prismjs'

Prism.languages.general = {
  'comment': /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
  'string': /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  'keyword': /\b(?:const|let|var|if|else|for|while|function|class|return)\b/,
  'boolean': /\b(?:true|false)\b/,
  'number': /\b\d+\b/,
  'function': /\b\w+(?=\()/,
  'punctuation': /[{}[\];(),.:]/,
}

const theme: { [key: string]: chalk.Chalk } = {
  keyword: chalk.blue,
  string: chalk.green,
  punctuation: chalk.dim,
  function: chalk.yellow,
  'class-name': chalk.cyan,
  comment: chalk.gray,
  boolean: chalk.red,
  number: chalk.magenta,
}

const highlight = (code: string, language: string = 'general') => {
  console.log('highlight called')
  const tokens = Prism.tokenize(code, Prism.languages[language])
  return tokens
    .map((token) => {
      if (typeof token === 'string') {
        return chalk.reset(token)
      }

      const style = theme[token.type]
      return style ? style(token.content) : token.content
    })
    .join('')
}

export const highlightCode = (code: string, language: string = 'general'): string => {
  const regex = new RegExp(/```([\s\S]*?)```/g) // only look for code within three backticks
  const codeBlocks = code.match(regex)
  if(!codeBlocks) return code
  for(let codeBlock of codeBlocks) {
    code = code.replace(codeBlock, highlight(codeBlock))
  }
  return code
}