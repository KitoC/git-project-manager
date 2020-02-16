const fs = require("fs");
const prettier = require("prettier");
const getConfigFile = require("./getConfigFile");

const writeToConfigFile = cb => {
  const { config, isJson, GPM_CONFIG_JSON, GPM_CONFIG_JS } = getConfigFile();

  const rewrittenConfig = cb(config);

  if (!rewrittenConfig) return;

  if (isJson) {
    fs.writeFileSync(
      GPM_CONFIG_JSON,
      prettier.format(`module.exports = ${JSON.stringify(rewrittenConfig)}`, {
        parser: "babel"
      })
    );
  } else {
    fs.writeFileSync(
      GPM_CONFIG_JS,
      prettier.format(`module.exports = ${JSON.stringify(rewrittenConfig)}`, {
        parser: "babel"
      })
    );
  }
};

module.exports = writeToConfigFile;
