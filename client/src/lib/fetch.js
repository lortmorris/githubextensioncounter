export default async function request(url = '', opts = {
  method: 'GET',
  mode: 'no-cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
}) {

  try {
    if (opts.body && Object.prototype.toString.call(opts.body) === '[object Object]') {
      opts.body = JSON.stringify(opts.body);
    }
    const response = await fetch(url, opts);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }

}
