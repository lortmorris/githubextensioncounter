const debug = require('debug')('githubextensionscounter:hooks:global');

function GlobalHooks(upInstance) {
  const {
    config,
    addHook,
  } = upInstance;

  async function afterSearch(req, dataDocument) {
    try {

      if (!(req.endpoint.publicFields || req.endpoint.skipFields)) {
        return dataDocument;
      }

      let { docs } = dataDocument;
      if (req.endpoint.publicFields) {
        docs = docs.map(d => Object.fromEntries(
          Object
            .entries(d)
            .filter(([k]) => req.endpoint.publicFields.includes(k)),
        ));
      } else if (req.endpoint.skipFields) {
        docs.forEach((doc) => {
          req.endpoint.skipFields.forEach((field) => {
            delete doc[field];
          });
        });
      }
      dataDocument.docs = docs;

      return dataDocument;
    } catch (err) {
      debug(err.message);
      throw err;
    }
  }

  addHook('*', 'afterSearch', afterSearch);
}


module.exports = GlobalHooks;
