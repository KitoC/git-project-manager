#!/usr/bin/env node

const fs = require("fs");
let customScripts = {};

if (fs.existsSync(`${process.cwd()}/scripts/index.js`)) {
  customScripts = require(`${process.cwd()}/scripts`);
}

const { getConfigFile, projectsMultiSelectPrompt } = require("./utils");
const gpmCommands = require("./gpm-commands");

const firstArg = process.argv[2];
const secondArg = process.argv[3];

const { createCommands } = require("./utils");

const executable = async () => {
  if (process.argv.includes("-h") || process.argv.includes("--help")) {
    console.log(`where <command> is one of:
    add, init, clone, remove
  
  gpm <command> -h  quick help on <command>
  `);
  } else if (gpmCommands[firstArg]) {
    gpmCommands[firstArg].command();
  } else {
    const { projects } = getConfigFile().config;

    let projectArray = [];

    let script = projects[firstArg]
      ? customScripts[secondArg]
      : customScripts[firstArg];

    if (!script) {
      script = {
        multi: true,
        command: ({ path, args }) => {
          let command = `cd ${path} && ${args.slice(0, args.length).join(" ")}`;

          return command;
        }
      };
    }

    if (projects[firstArg]) {
      projectArray.push(firstArg);
    } else {
      if (!script.disablePrompt) {
        projectArray = await projectsMultiSelectPrompt(script);
      }
    }

    createCommands(script, projectArray);
  }
};

executable();
