import {
  getReposByUsername,
  getLastCommit,
  getDirTreeFromRepo,
} from './github';

const repository = 'universal-pattern';
const username = 'lortmorris';
let lastCommit = null;

test(`get all repositories from ${username} account`, async () => {
  const repos = await getReposByUsername(username);
  expect(repos)
  .toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        html_url: expect.any(String),
      })
    ])
  );
});


test(`get last commit from ${username}/${repository}`, async () => {
  expect.assertions(1);
  lastCommit = await getLastCommit(username, repository);
  expect(lastCommit)
    .toEqual(
      expect.objectContaining({
        sha: expect.any(String),
      })
    );

});

test('get all files from repository', async () => {
  const files = await getDirTreeFromRepo(lastCommit);
  console.info(files);
})
