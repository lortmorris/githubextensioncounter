async function Boot(upInstance) {
  const {
    services,
    libs,
  } = upInstance;

  const hasKeys = await services.findOne('/keys', {});
  if (!hasKeys) {
    console.info('without keys');
    await services.insert('/keys', {
      userid: '000000000000000000000001',
      apikey: '-2jdjaksdjad9923--as-d-asd-asd-0-22i2idjiiasd2929--a-sd-as-dm2k2k2a-sdASD22992--asd',
      secret: '',
      ratelimit: 1000000,
      allow: [],
      deny: [],
      level: 10,
    });
  }

  const filesTesting = await services.findOne('/files', {});
  if (!filesTesting) {
    console.info('without repos for testing');
    await services.insert('/files', [
      {
        account: 'testing',
        repo: 'repotesting',
        file: 'test1.js'
      },
      {
        account: 'testing',
        repo: 'repotesting',
        file: 'test2.js'
      },
  ]);
  }

  return true;
}

module.exports = Boot;
