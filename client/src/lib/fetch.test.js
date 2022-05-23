import Request from './fetch';

const url = 'https://api.github.com/repos/lortmorris/universal-pattern/commits';

test(`request to ${url}`, async () => {
  const response = await Request(url);

  expect(response)
  .toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        sha: expect.any(String),
        url: expect.any(String),
      })
    ])
  );
});
