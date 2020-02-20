const {
  createCommands,
  writeToConfigFile,
  projectsMultiSelectPrompt,
  getConfigFile
} = require("../utils");

module.exports = async () => {
  const { projects, options = {} } = getConfigFile().config;

  const projectsToClone = await projectsMultiSelectPrompt({ multi: true });

  writeToConfigFile(gpmConfig => {
    Object.keys(projects).forEach(project => {
      if (projectsToClone.includes(project)) {
        gpmConfig.projects[project].enabled = true;
      } else {
        gpmConfig.projects[project].enabled = false;
      }
    });

    return gpmConfig;
  });

  const command = ({ path, gitUrl }) => {
    if (options.gitSubmodules) {
      return `git submodule add ${gitUrl} ${path} && git submodule update --init --recursive`;
    } else {
      return `git clone ${gitUrl} ${path}`;
    }
  };

  createCommands(command);
};
