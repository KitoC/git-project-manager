const fs = require("fs");
const consoleMessage = require("./console-message");

const getConfigFile = cb => {
  const ROOT_DIR = process.cwd();
  const GPM_CONFIG_JS = `${ROOT_DIR}/gpm.config.js`;
  const GPM_CONFIG_JSON = `${ROOT_DIR}/gpm.json`;
  let isJson = false;
  let config = null;

  if (fs.existsSync(GPM_CONFIG_JSON)) {
    isJson = true;
    config = require(GPM_CONFIG_JSON);
  }

  if (fs.existsSync(GPM_CONFIG_JS)) {
    config = require(GPM_CONFIG_JS);
  }

  if (!config) {
    return consoleMessage.error(
      "Current working directory is not a gpm directory. Please run 'gpm init'."
    );
  }

  return { isJson, config, GPM_CONFIG_JSON, GPM_CONFIG_JS };
};

module.exports = getConfigFile;
