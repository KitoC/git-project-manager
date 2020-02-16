const consoleMessage = {
  warn: msg => console.log(`\n\n\u001b[33mwarning:\u001b[0m ${msg}\n\n`),
  error: msg => console.log(`\n\n\u001b[31merror:\u001b[0m ${msg}\n\n`),
  success: msg => console.log(`\n\n\u001b[32msuccess:\u001b[0m ${msg}\n\n`),
  info: msg => console.log(`\n\n\u001b[36minfo:\u001b[0m ${msg}\n\n`)
};

module.exports = consoleMessage;
