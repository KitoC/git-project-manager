const writeToConfigFile = require("./write-to-config-file");
const consoleMessage = require("./console-message");
const getConfigFile = require("./getConfigFile");
const createCommands = require("./create-commands");
const writeGitIgnore = require("./write-git-ignore");
const gpmINIT = require("./gpm-init");

const projectTypes = {
  frontend: "frontend",
  microservice: "microservices"
};

const colors = {
  frontend: "green",
  backend: "blue",
  module: "yellow",
  [projectTypes.frontend]: "green",
  [projectTypes.module]: "yellow",
  [projectTypes.microservice]: "blue"
};

const createProjectCommand = ({ path, project, command }) => ({
  command: `cd ${path}/${project} && ${command}`,
  name: `${path} -- ${project}`,
  prefixColor: colors[path]
});

module.exports = {
  colors,
  projectTypes,
  createProjectCommand,
  writeToConfigFile,
  consoleMessage,
  getConfigFile,
  createCommands,
  writeGitIgnore,
  gpmINIT
};
