import fs from "fs";
import { ChatCompletionRequestMessage } from "openai";
import path from "path";
import { calcTokens } from "./openai";
import chalk from 'chalk'

type dialogue = {
  messagesHistory: ChatCompletionRequestMessage[]
  historyTokens: string,
}

type Store = {
  dialogues: {[key: string]: dialogue}
  totalExpense: string,
};

const configFilePath = path.resolve(__dirname, "../.env");
const storeFilePath = path.resolve(__dirname, '../store.json'); // store.json should have the default store when people install this plugin

export function readApiKey(): string | undefined {
  if (!fs.existsSync(configFilePath)) {
    return undefined;
  }

  const rawData = fs.readFileSync(configFilePath, "utf8");
  const match = /OPENAI_KEY=(.*)/.exec(rawData);
  return match ? match[1] : undefined;
}


export function readEnv(variable: string): string | undefined {
  if (!fs.existsSync(configFilePath)) {
    return undefined;
  }

  const rawData = fs.readFileSync(configFilePath, "utf8");
  const match = RegExp(`${variable}=(.*)`).exec(rawData);
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
  writeStore(ps => {
    ps.dialogues.agentChat.messagesHistory = []
    ps.dialogues.agentChat.historyTokens = "0"
    ps.totalExpense = "0"
    return ps
  })
  console.log('message history cleared')
}


export const trimMessages = (number = 5) => {
  writeStore(ps => {
    const messagesHistory = ps.dialogues.agentChat.messagesHistory
    const firstMessage = messagesHistory.shift();
    if(!firstMessage) throw new Error("tried to trim messages, but there was no first message")
    let trimmedMsgsTokens = 0 // delete
    for(let i = 0; i < number; i++) {
    
      const trimmed = messagesHistory.shift()
      if(!trimmed) throw new Error("state -> trimMessages() no messages to trim")
      trimmedMsgsTokens += calcTokens(trimmed.content) //delete
    }
    console.log(chalk.yellow(`${trimmedMsgsTokens} tokens trimmed`)) //delete

    messagesHistory.unshift(firstMessage)
    ps.dialogues.agentChat.historyTokens = `${parseInt(ps.dialogues.agentChat.historyTokens) - trimmedMsgsTokens}`
    return ps
  })
}
