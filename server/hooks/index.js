const globalHooks = require('./global');

const hooks = (upInstance) => {
  globalHooks(upInstance);
};

module.exports = hooks;
