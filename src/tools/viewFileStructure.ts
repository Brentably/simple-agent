import fs from 'fs';
import path from 'path';

export default function viewFileStructure() {
  const currentDirectory = process.cwd();
  const files = fs.readdirSync(currentDirectory);

  function getGitIgnoredFiles() {
    const gitignorePath = path.join(currentDirectory, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      return fs.readFileSync(gitignorePath, 'utf-8').split('\n').filter(line => line.trim() !== '').map(file => file.split('/').join(''));
    }
    return [];
  }

  const gitIgnoredFiles = getGitIgnoredFiles();
  let fileStructure = ''
  function traverseDirectory(directory: string, depth: number) {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
      if (gitIgnoredFiles.includes(file) || file.startsWith('.')) return;

      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const fileType = stats.isDirectory() ? '[DIR] ' : '[FILE]';
      const indentation = '  '.repeat(depth);
      fileStructure += `${indentation}${fileType.padEnd(7)} ${file}\n`;

      if (stats.isDirectory()) {
        traverseDirectory(filePath, depth + 1);
      }
    });
  }

  traverseDirectory(currentDirectory, 0);
  return fileStructure;
}