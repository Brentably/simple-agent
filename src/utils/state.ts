import fs from "fs";
import path from "path";

interface Config {
  apiKey: string;
}
const configFilePath = path.resolve(__dirname, "../../.env");

export function readApiKey(): string | undefined {
  if (!fs.existsSync(configFilePath)) {
    return undefined;
  }

  const rawData = fs.readFileSync(configFilePath, "utf8");
  const match = /API_KEY=(.*)/.exec(rawData);
  return match ? match[1] : undefined;
}

export function writeApiKey(apiKey: string): void {
  const dataToWrite = `OPENAI_KEY=${apiKey}`;
  fs.writeFileSync(configFilePath, dataToWrite);
}
