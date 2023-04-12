#!/usr/bin/env node

import { Command } from "commander";
import chat from "./chat";
import fs from 'fs'
import path from 'path'


const program = new Command()

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), 'utf8'));
const { version, description } = packageJson;

program.version(version).description('chat with chatGPT!')

program
  .action(() => chat())


program.parseAsync(process.argv)