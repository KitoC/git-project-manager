#!/usr/bin/env node

const fs = require("fs");
let customScripts = {};

if (fs.existsSync(`${process.cwd()}/scripts/index.js`)) {
  customScripts = require(`${process.cwd()}/scripts`);
}

const { getConfigFile, gpmINIT } = require("./utils");
const gpmCommands = require("./gpm-commands");

const firstArg = process.argv[2];
const secondArg = process.argv[3];

const { createCommands } = require("./utils");

if (gpmCommands[firstArg]) {
  gpmCommands[firstArg]();
} else {
  const { projects } = getConfigFile().config;
  const projectArray = [];
  let customScript = projects[firstArg]
    ? customScripts[secondArg]
    : customScripts[firstArg];

  if (projects[firstArg]) {
    projectArray.push(firstArg);
  }

  const defaultCmd = ({ path, args }) => {
    let command = `cd ${path} && ${args.slice(2, args.length).join(" ")}`;

    return command;
  };

  const cmd = customScript ? customScript : defaultCmd;

  createCommands(cmd, projectArray);
}