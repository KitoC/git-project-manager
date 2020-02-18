const prompts = require("prompts");
const getConfigFile = require("./getConfigFile");

const projectsMultiSelectPrompt = async () => {
  const { projects } = getConfigFile().config;

  const { selectedProjects } = await prompts([
    {
      type: "multiselect",
      name: "selectedProjects",
      message: "Pick the projects you want to enable and clone.",
      choices: Object.entries(projects).map(([projectName, { enabled }]) => ({
        title: projectName,
        value: projectName,
        selected: enabled
      }))
    }
  ]);

  return selectedProjects;
};

module.exports = projectsMultiSelectPrompt;
