const { writeGitIgnore, createCommands } = require("../utils");

module.exports = () => {
  const { consoleMessage, writeToConfigFile } = require("../utils");

  const projectToRemove = process.argv.pop();

  writeToConfigFile(gpmConfig => {
    if (!gpmConfig.projects[projectToRemove]) {
      consoleMessage.warn("Project already removed.");
      return null;
    }

    const command = ({ path }) => `rm -rf ${path}`;

    createCommands(command, [projectToRemove], true);

    delete gpmConfig.projects[projectToRemove];

    writeGitIgnore(gpmConfig);

    return gpmConfig;
  });
};