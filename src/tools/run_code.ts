import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function run_code(code: string): string {
  const filePath = path.join(__dirname, '..', '..', 'agent-notepad.js');
  fs.writeFileSync(filePath, code);

  try {
    const output = execSync(`node ${filePath}`);
    return output.toString() || 'success'
  } catch (error: any) {
    if(!error.stderr) throw new Error('no stderr property on error thrown from execSync. check runBashCommand.ts')
    return error.stderr
  }

}