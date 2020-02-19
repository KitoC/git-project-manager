const prompts = require("prompts");
const getConfigFile = require("./getConfigFile");

const projectsMultiSelectPrompt = async ({ multi }) => {
  const { projects } = getConfigFile().config;

  const message = `Pick the ${
    multi ? "'projects" : "project"
  } you want to run the command on.`;

  const { selectedProjects } = await prompts([
    {
      type: multi ? "multiselect" : "select",
      name: "selectedProjects",
      message,
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
