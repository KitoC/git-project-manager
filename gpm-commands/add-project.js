const { writeGitIgnore } = require("../utils");

module.exports = {
  command: () => {
    const {
      consoleMessage,
      writeToConfigFile,
      createCommands
    } = require("../utils");
    const cloneImmediately = process.argv.find(arg => arg === "--clone");

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

      gpmConfig.projects[gitRepoName] = {
        gitUrl,
        path: `${targetPath ? `${targetPath}/` : ""}${gitRepoName}`,
        enabled: true
      };

      writeGitIgnore(gpmConfig);

      return gpmConfig;
    });

    if (cloneImmediately) {
      createCommands(
        ({ path, gitUrl }) => {
          return `git clone ${gitUrl} ${path}`;
        },
        [gitRepoName]
      );
    }
  }
};
