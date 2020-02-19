module.exports = {
  command: async () => {
    const {
      createCommands,
      writeToConfigFile,
      projectsMultiSelectPrompt,
      getConfigFile
    } = require("../utils");
    const { projects } = getConfigFile().config;

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

    const command = {
      command: ({ path, gitUrl }) => `git clone ${gitUrl} ${path}`
    };

    createCommands(command);

    return `git clone ${gitUrl} ${path}`;
  }
};
