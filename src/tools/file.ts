import fs from 'fs'

export function create_file(file_path: string) {
  fs.writeFileSync(file_path, '');
  return "success"
}

export function read_file(file_path: string) {
  return fs.readFileSync(file_path, 'utf8');
}

export function write_to_file(file_path: string, content: string) {
  fs.writeFileSync(file_path, content.replace(/\\n/g, '\n'));
  return "success"
}