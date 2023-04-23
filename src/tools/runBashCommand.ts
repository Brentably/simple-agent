import {execSync} from "child_process"
import { getUserConfirmation } from "../user";
import chalk from 'chalk'

export async function runBashCommand(command: string ) {
  if(command.includes('sudo')) throw new Error('suggested command contains sudo :/')
  const isApproved = await getUserConfirmation(`run ${chalk.red(command)}`)

  if(!isApproved) return "The user did not approve that action."

  try {
    console.log(`calling execSync(${command})`)
    const output = execSync(command);
    return output.toString() || 'success'
  } catch (error: any) {
    if(!error.stderr) throw new Error('no stderr property on error thrown from execSync. check runBashCommand.ts')
    return error.stderr
  }

}