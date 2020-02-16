const getConfigFile = require("./getConfigFile");
const consoleMessage = require("./console-message");
const concurrently = require("concurrently");

const createCommands = (callback, projectArray = []) => {
  const { config } = getConfigFile();
  const { colors = {} } = config;
  let filterItems = projectArray;

  const onlyOption = process.argv.find(arg => arg.includes("--only="));

  if (onlyOption) {
    filterItems = onlyOption.replace("--only=", "").split(",");
  }

  const projects = Object.entries(config.projects)
    .map(([projectName, projectConfig]) => ({ projectName, projectConfig }))
    .filter(({ projectName, projectConfig }) => {
      if (filterItems.length) return filterItems.includes(projectName);

      return projectConfig.enabled;
    });

  const [first, second, ...args] = process.argv.filter(arg => {
    if (arg.includes("--only")) return false;
    if (filterItems.includes(arg)) return false;

    return true;
  });

  const projectCommands = projects.map(({ projectName, projectConfig }) => {
    const { path } = projectConfig;

    let command = callback({ args, ...projectConfig, projectName });

    if (!command) {
      consoleMessage.warn(
        "Any CLI commands must be returned from your custom script function as a string. Whatever is executed in your custom script will still be run however."
      );
    }
    const prefixColor = colors[path] || "white";

    return { command: command || " ", name: projectName, prefixColor };
  });

  if (!projectCommands.length) {
    return consoleMessage.error(
      "It seems that all projects have been disabled... Or maybe you just don't have any... Take a look in the gpm.config.js and enable any projects you are wanting to run commands on."
    );
  }

  concurrently(projectCommands, {
    prefix: "name",
    killOthers: ["failure", "success"],
    restartTries: 0
  }).then(
    () => {
      consoleMessage.success("all commands run successfully.");
    },
    () => {
      consoleMessage.error(
        "Something went wrong with the script you ran on one of your projects. Please check the logs above to see where it failed."
      );
    }
  );
};

module.exports = createCommands;
