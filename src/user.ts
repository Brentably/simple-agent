import readline from 'readline';
import inquirer from 'inquirer';

export async function getUserInput(prefix: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer: string = await new Promise((resolve) => {
    rl.question(prefix, (input) => {
      resolve(input);
      rl.close();
    });
  });

  return answer;
}

export async function getUserConfirmation(actionToConfirm: string) {
  const questions = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: `Are you sure you want to ${actionToConfirm}?`,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.confirmation;
}