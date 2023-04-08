import fs from "fs";
import { ChatCompletionRequestMessage } from "openai";
import path from "path";


interface Config {
  apiKey: string;
}

type Store = {
  messagesHistory: ChatCompletionRequestMessage[]
  [key:string]:any;
};

const configFilePath = path.resolve(__dirname, "../../.env");

export function readApiKey(): string | undefined {
  return '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';
  // if (!fs.existsSync(configFilePath)) {
  //   return undefined;
  // }

  // const rawData = fs.readFileSync(configFilePath, "utf8");
  // const match = /OPENAI_KEY=(.*)/.exec(rawData);
  // return match ? match[1] : undefined;
}

export function writeApiKey(apiKey: string): void {
  const dataToWrite = `OPENAI_KEY=${apiKey}`;
  fs.writeFileSync(configFilePath, dataToWrite);
}


export function readStore(): Store {
    // Read and parse the contents of store.json file
    const rawData = fs.readFileSync("./store.json");
    const data = JSON.parse(rawData.toString()) as Store;
    return data;
}

// to write to store, you pass in an update function which takes in the value of the previous store and returns what you want the new store to be. OR you can pass in the new store
export function writeStore(update: (prevStore: Store) => Store | Store) {
  try {
    const newStore = (typeof update === "function") ? update(readStore()) : update
    // Convert the data object to JSON and write to store.json file
    const jsonData = JSON.stringify(newStore, null, 2);
    fs.writeFileSync("./store.json", jsonData);
    // console.log("store.json file updated successfully");
  } catch (err) {
    console.log("Error writing to store.json file:", err);
  }
}


export function print(a: any) {
  console.log(a);
}