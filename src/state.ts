import fs from "fs";
import { ChatCompletionRequestMessage } from "openai";
import path from "path";
import { calcTokens } from "./openai";


interface Config {
  apiKey: string;
}

type Store = {
  messagesHistory: ChatCompletionRequestMessage[]
  historyTokens: string,
  totalExpense: string
};

const configFilePath = path.resolve(__dirname, "../.env");
const storeFilePath = path.resolve(__dirname, `${isDev() ? '../devStore.json' : '../store.json'}`); // store.json should have the default store when people install this plugin

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

export function isDev(): boolean {
  if (!fs.existsSync(configFilePath)) {
    return false;
  }
  const rawData = fs.readFileSync(configFilePath, "utf8");
  const match = /DEV=(.*)/.exec(rawData);
  if(match?.[1].toLowerCase() === "true") return true
  return false
}

export function readStore(): Store {
    // Read and parse the contents of store.json file
    const rawData = fs.readFileSync(storeFilePath);
    const data = JSON.parse(rawData.toString()) as Store;
    return data;
}

// to write to store, you pass in an update function which takes in the value of the previous store and returns what you want the new store to be. OR you can pass in the new store
export function writeStore(update: (prevStore: Store) => Store | Store) {
  try {
    const newStore = (typeof update === "function") ? update(readStore()) : update
    // Convert the data object to JSON and write to store.json file
    const jsonData = JSON.stringify(newStore, null, 2);
    fs.writeFileSync(storeFilePath, jsonData);
    // console.log("store.json file updated successfully");
  } catch (err) {
    console.log("Error writing to store.json file:", err);
  }
}

export function clearChat() {
  writeStore(ps => ({...ps, historyTokens: "12", messagesHistory: [{"role": "system", "content": "You are a helpful assistant who helps write code"}]}))
  console.log('message history cleared')
}

export const trimMessages = (number: number = 5) => {
  writeStore(ps => {
    const messagesHistory = ps.messagesHistory
    const firstMessage = messagesHistory.shift();
    if(!firstMessage) throw new Error("tried to trim messages, but there was no first message")
    let trimmedMsgs = '' // delete
    for(let i = 0; i < number; i++) {
      const trimmed = messagesHistory.shift()
      trimmedMsgs += trimmed //delete
    }

    console.log(`${calcTokens(trimmedMsgs)} tokens trimmed`) //delete

    messagesHistory.unshift(firstMessage)
    return ({...ps, messagesHistory})
  })
}
