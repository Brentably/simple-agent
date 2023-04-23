import { parseAction } from "../helpers";



const parsedAction = parseAction(`Thought: The user wants a JavaScript function that always returns true. This is a simple function that I can write quickly.
Action: finish(
\`\`\`
const alwaysTrue = () => {
  return true;
};
\`\`\`
)`)


var final = JSON.stringify(['finish', `
\`\`\`
const alwaysTrue = () => {
  return true;
};
\`\`\`
`
])

const didPass = JSON.stringify(parsedAction) == final

didPass ? console.log("==========\nPASSED\n==========") : console.log("==========\nFAILED :(\n==========")