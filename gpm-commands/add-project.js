const {
  writeGitIgnore,
  consoleMessage,
  writeToConfigFile,
  createCommands,
  getConfigFile
} = require("../utils");
const shell = require("shelljs");

module.exports = () => {
  const cloneImmediately = process.argv.find(arg => arg === "--clone");
  const { options = {} } = getConfigFile().config;

  const [first, second, ...args] = process.argv.filter(arg => {
    if (arg.includes("--clone")) return false;

    return true;
  });

  const gitUrl = args[1];
  const targetPath = args[2];

  const gitRepoName = gitUrl
    .split("/")
    .pop()
    .replace(".git", "");

  writeToConfigFile(gpmConfig => {
    if (gpmConfig.projects[gitRepoName]) {
      consoleMessage.warn("Project already exists.");
      return null;
    }

    const path = `${targetPath ? `${targetPath}/` : ""}${gitRepoName}`;
    gpmConfig.projects[gitRepoName] = {
      gitUrl,
      path,
      enabled: true
    };

    writeGitIgnore(gpmConfig);

    return gpmConfig;
  });

  if (cloneImmediately) {
    createCommands(
      ({ path, gitUrl }) => {
        if (options.gitSubmodules) {
          return `git submodule add ${gitUrl} ${path} && git submodule update --init --recursive`;
        } else {
          return `git clone ${gitUrl} ${path}`;
        }
      },
      [gitRepoName]
    );
  }
};
