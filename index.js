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
    gpmCommands[firstArg]();
  } else {
    const { projects } = getConfigFile().config;

    let projectArray = [];

    let customScript = projects[firstArg]
      ? customScripts[secondArg]
      : customScripts[firstArg];

    if (projects[firstArg]) {
      projectArray.push(firstArg);
    } else {
      projectArray = await projectsMultiSelectPrompt();
    }

    const defaultCmd = ({ path, args }) => {
      let command = `cd ${path} && ${args.slice(0, args.length).join(" ")}`;

      return command;
    };

    const cmd = customScript ? customScript : defaultCmd;

    createCommands(cmd, projectArray);
  }
};

executable();
