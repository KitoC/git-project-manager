const { writeGitIgnore } = require("../utils");

module.exports = () => {
  const { consoleMessage, writeToConfigFile } = require("../utils");

  const gitUrl = process.argv[4];
  const targetPath = process.argv[5];

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
      path: `${targetPath ? `${targetPath}/` : ""}${gitRepoName}`
    };

    writeGitIgnore(gpmConfig);

    return gpmConfig;
  });
};
