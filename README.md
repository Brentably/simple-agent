<<<<<<< HEAD
# Simple Agent Repository

To get started, clone the repo, `npm install` or `yarn`, and run `npm start`

=======
# wtfdid-cli

A CLI for GPT-3.5 / GPT-4 with a focus on simplicity and ease of use.

## Installation

Install the CLI globally using npm: 

```bash
npm i -g wtfdid-cli
```

## Usage

The CLI provides several commands for different purposes:

### Chat with GPT

Start a conversation with GPT:

```bash
wtfchat
```

To use GPT-4 instead, add the `-4` flag:

```bash
wtfchat -4
```

### Ask GPT about a file

Ask GPT a question about a specific file:

```bash
wtfhack ask <filepath> [...your question here]
```

Example:

```bash
wtfhack ask src/index.ts "my helloWorld() function isn't working right... what should I do?"
```

To use GPT-4 instead, add the `-4` flag:

```bash
wtfhack ask -4 src/index.ts "my helloWorld() function isn't working right... what should I do?"
```

### Edit a file with GPT's help

Ask GPT to edit a file based on your instructions:

```bash
wtfhack write <filepath> [...instructions here]
```

Example:

```bash
wtfhack write src/index.ts "add a function called ligma which returns nuts and balls with 50 percent probability"
```

If the edit isn't what you expected, you can always undo the changes with your editor's undo command (e.g., CMD-Z).

### Shortcuts

You can use shortcuts for the `ask` and `write` commands:

- `wtfhack a` instead of `wtfhack ask`
- `wtfhack w` instead of `wtfhack write`



P.S.
big props to `wtfhack -4 w` for helping me write this readme ;)




====================================================================
Notice: Usage Tracking

We collect basic usage data to understand how frequently our CLI app is being used. We DO NOT collect detailed usage information or any personal data.

By using this application, you agree to the collection of anonymous usage frequency data. If you want to opt out, contact me @BingBongBrent on Twitter, or submit a PR with an opt out option, or fork the repo :)
====================================================================
>>>>>>> bbc99a0f38a9b2b7995e6681317559545bb83924
