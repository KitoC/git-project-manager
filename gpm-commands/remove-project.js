const {
  writeGitIgnore,
  createCommands,
  consoleMessage,
  writeToConfigFile,
  getConfigFile
} = require("../utils");

module.exports = () => {
  const { options = {} } = getConfigFile().config;

  const projectToRemove = process.argv.pop();

  writeToConfigFile(gpmConfig => {
    if (!gpmConfig.projects[projectToRemove]) {
      consoleMessage.warn("Project already removed.");
      return null;
    }

    const command = ({ path }) => `rm -rf ${path}`;

    createCommands(command, [projectToRemove], true);

    delete gpmConfig.projects[projectToRemove];

    if (!options.gitSubmodules) writeGitIgnore(gpmConfig);

    return gpmConfig;
  });
};
