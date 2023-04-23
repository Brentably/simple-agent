import { parseAction } from "../helpers";



// const parsedAction = parseAction(`Thought: The user wants a JavaScript function that always returns true. This is a simple function that I can write quickly.
// Action: finish(
// \`\`\`
// const alwaysTrue = () => {
//   return true;
// };
// \`\`\`
// )`)


// var final = JSON.stringify(['finish', `
// \`\`\`
// const alwaysTrue = () => {
//   return true;
// };
// \`\`\`
// `
// ])

// const didPass = JSON.stringify(parsedAction) == final

// didPass ? console.log("==========\nPASSED\n==========") : console.log("==========\nFAILED :(\n==========")


console.log(parseAction(`Thought: I apologize for the mistake in my previous response. I will provide a corrected response.
Action:
\`\`\`
const file_path = "file.ts";
const function_name = "ligma";
const function_body = "return 'nuts';";

// Check if the file exists
if (!read_file(file_path)) {
  // If the file doesn't exist, create it
  create_file(file_path);
}

// Write the new function to the file
write_to_file(file_path, \`\n\nconst \${function_name} = () => {\n  \${function_body}\n};\`);

// Let the user know the function was added successfully
finish("The function was added to the file successfully!");
\`\`\`
justAction file_path = "file.ts";
const function_name = "ligma";
const function_body = "return 'nuts';";

// Check if the file exists
if (!read_file(file_path)) {
  // If the file doesn't exist, create it
  create_file(file_path);
}

// Write the new function to the file
write_to_file(file_path, \`\n\nconst \${function_name} = () => {\n  \${function_body}\n};\`);

// Let the user know the function was added successfully
finish("The function was added to the file successfully!");
\`\`\``))
