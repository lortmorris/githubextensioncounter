import {
  saveFile,
  getFilesByAccountAndRepo,
} from './api';

const repository = 'repotesting';
const username = 'testing';
let lastCommit = null;

test(`get all files from ${username} account, repo ${repository}`, async () => {
  const files = await getFilesByAccountAndRepo(username, repository);
  expect(files)
  .toEqual(
    expect.objectContaining({
      docs: expect.arrayContaining([
        expect.objectContaining({
          file: expect.any(String),
          repo: repository,
          account: username,
        })
      ])
    })
  );
});


test(`insert new file into ${username}/${repository}`, async () => {
  lastCommit = await saveFile(username, repository, `${Math.random().toString(32)}.js`);
  expect(lastCommit)
    .toEqual(
      expect.objectContaining({
        _id: expect.any(String),
      })
    );

});
