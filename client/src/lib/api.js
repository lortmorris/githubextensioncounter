import Request from './fetch';

export async function saveFile(account, repo, file) {
  try {
    const inserted = await Request('http://localhost:3650/core/files', {
      method: 'put',
      body: {
        account,
        repo,
        file,
      },
      headers: {
        apikey: '-2jdjaksdjad9923--as-d-asd-asd-0-22i2idjiiasd2929--a-sd-as-dm2k2k2a-sdASD22992--asd',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return inserted;
  } catch (err) {
    throw new Error(err);
  }
}


export async function getFilesByAccountAndRepo(account, repo) {
  try {
    const inserted = await Request(`http://localhost:3650/core/files?page=1&limit=1000000&q=account:${account},repo:${repo}`, {
      method: 'get',
      headers: {
        apikey: '-2jdjaksdjad9923--as-d-asd-asd-0-22i2idjiiasd2929--a-sd-as-dm2k2k2a-sdASD22992--asd',
      }
    });
    return inserted;
  } catch (err) {
    throw new Error(err);
  }
}
