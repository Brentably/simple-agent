import fs from "fs";
import path from "path";

interface Config {
  apiKey: string;
}

type Store = any;

const configFilePath = path.resolve(__dirname, "../../.env");

export function readApiKey(): string | undefined {
  if (!fs.existsSync(configFilePath)) {
    return undefined;
  }

  const rawData = fs.readFileSync(configFilePath, "utf8");
  const match = /OPENAI_KEY=(.*)/.exec(rawData);
  return match ? match[1] : undefined;
}

export function writeApiKey(apiKey: string): void {
  const dataToWrite = `OPENAI_KEY=${apiKey}`;
  fs.writeFileSync(configFilePath, dataToWrite);
}


export function readStore(): Store | null {
  try {
    // Read and parse the contents of store.json file
    const rawData = fs.readFileSync("../store.json");
    const data = JSON.parse(rawData.toString()) as Store;
    return data;
  } catch (err) {
    console.log("Error reading store.json file:", err);
    return null;
  }
}

export function writeStore(data: Store) {
  try {
    // Convert the data object to JSON and write to store.json file
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync("../store.json", jsonData);
    console.log("store.json file updated successfully");
  } catch (err) {
    console.log("Error writing to store.json file:", err);
  }
}


export function print(a: any) {
  console.log(a);
}
