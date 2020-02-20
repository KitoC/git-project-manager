const fs = require("fs");
const prettier = require("prettier");
const consoleMessage = require("../utils/console-message");
const shell = require("shelljs");
const gpmINIT = () => {
  const ROOT = process.cwd();
  const SCRIPTS_DIR = `${ROOT}/scripts`;
  const SCRIPTS_INDEX = `${ROOT}/scripts/index.js`;
  const GPM_CONFIG = `${ROOT}/gpm.config.js`;

  if (fs.existsSync(GPM_CONFIG)) {
    return consoleMessage.info("'gpm init' has already been run.");
  }

  if (!fs.existsSync(SCRIPTS_DIR)) fs.mkdirSync(SCRIPTS_DIR);

  fs.writeFileSync(
    SCRIPTS_INDEX,
    prettier.format(
      `
      // Your custom scripts can go here.
      module.exports = {};
  `,
      { parser: "babel" }
    )
  );

  fs.writeFileSync(
    GPM_CONFIG,
    prettier.format(
      `
      module.exports = {
        projects: {},
        colors: {}
      };
  `,
      { parser: "babel" }
    )
  );

  shell.exec("git init");
};

module.exports = gpmINIT;
