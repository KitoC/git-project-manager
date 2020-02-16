const prompts = require("prompts");

module.exports = async () => {
  const {
    createCommands,
    writeToConfigFile,
    getConfigFile
  } = require("../utils");
  const { projects } = getConfigFile().config;

  const { projects_to_clone } = await prompts([
    {
      type: "multiselect",
      name: "projects_to_clone",
      message: "Pick the projects you want to enable and clone.",
      choices: Object.entries(projects).map(([projectName, { enabled }]) => ({
        title: projectName,
        value: projectName,
        selected: enabled
      }))
    }
  ]);

  writeToConfigFile(gpmConfig => {
    Object.keys(projects).forEach(project => {
      if (projects_to_clone.includes(project)) {
        gpmConfig.projects[project].enabled = true;
      } else {
        gpmConfig.projects[project].enabled = false;
      }
    });

    return gpmConfig;
  });

  createCommands(({ path, gitUrl }) => {
    return `git clone ${gitUrl} ${path}`;
  });
};
