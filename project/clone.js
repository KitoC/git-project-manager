module.exports = () => {
  const { createCommands } = require("../utils");

  createCommands(({ path, gitUrl, projectName }) => {
    return `git clone ${gitUrl} ${path}`;
  });
};
