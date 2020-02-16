const fs = require("fs");

const writeGitIgnore = gpmConfig => {
  const ignoredProjects = Object.keys(gpmConfig.projects)
    .map(key => `**/${key}\n`)
    .join("");

  const gitIgnoreContent = `node_modules\n${ignoredProjects}`;

  const gitIgnorePath = `${process.cwd()}/.gitignore`;

  fs.writeFileSync(gitIgnorePath, gitIgnoreContent);
};

module.exports = writeGitIgnore;
