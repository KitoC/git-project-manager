const getConfigFile = require("./getConfigFile");
const consoleMessage = require("./console-message");
const concurrently = require("concurrently");
const isFunction = require("lodash/isFunction");

const createCommands = (script, projectArray = []) => {
  try {
    const { config } = getConfigFile();
    const { colors = {} } = config;
    let filterItems = projectArray;
    let COMMAND;

    if (isFunction(script)) {
      COMMAND = script;
    } else {
      COMMAND = script.command;
    }

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

    if (!script.multi && script.disablePrompt) {
      return COMMAND({ args, logger: consoleMessage });
    }

    Promise.all(
      projects.map(async ({ projectName, projectConfig }) => {
        const { path } = projectConfig;

        let command = await COMMAND({
          args,
          ...projectConfig,
          projectName,
          logger: consoleMessage
        });

        const prefixColor = colors[path] || "white";

        return { command: command || " ", name: projectName, prefixColor };
      })
    )
      .then(projectCommands => {
        if (!projectCommands.length) {
          return consoleMessage.error(
            "It seems that all projects have been disabled... Or maybe you just don't have any... Take a look in the gpm.config.js and enable any projects you are wanting to run commands on."
          );
        }

        concurrently(projectCommands, {
          prefix: "name",
          killOthers: ["failure", "success"],
          restartTries: 3
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
      })
      .catch(error => {
        if (error) consoleMessage.error(error);
      });
  } catch (error) {
    if (error) consoleMessage.error(error);
  }
};

module.exports = createCommands;
