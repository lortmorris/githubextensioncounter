import Request from './fetch';

export async function getReposByUsername(username) {
  try {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid github username');
    }
    const repos = await Request(`https://api.github.com/users/${username}/repos`);
    return repos;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getLastCommit(username, repository) {
  try {
    if (!username || typeof username !== 'string') {
      throw new Error('Invalid github username');
    }

    if (!repository || typeof repository !== 'string') {
      throw new Error('Invalid repository');
    }

    const lastCommits = await Request(`https://api.github.com/repos/${username}/${repository}/commits`);
    if (Array.isArray(lastCommits) && lastCommits.length > 0) {
      return lastCommits.shift();
    }
    return null;
  } catch (err) {
      throw new Error(err);
  }
}

async function getDirTreeByStep(finalFiles = [], url, path = '') {
  const files = await Request(url);

  const directories = [];
  if (!files.tree) return true;
  files.tree.forEach((item) => {
    if (item.type !== 'tree') {
      finalFiles.push(`${path}/${item.path}`);
    }

    const level = path.split('/').length;
    if (item.type === 'tree' &&  level <= 3) {
      console.info('item directories: ', item);
      directories.push(item);
    }
  });

  const tasks = directories.map(async (dir) => {
    await getDirTreeByStep(finalFiles, dir.url, `${path}/${dir.path}`);
  });

  if (tasks.length > 0) {
    return await Promise.all(tasks);
  }

  return true;
}

export async function getDirTreeFromRepo(lastCommit) {
  try {
    if (!lastCommit || !lastCommit.sha) {
      throw new Error('Invalid lastCommit')
    }

    const tree = [];
    let final = false;
    while (!final) {
      const url = 'https://api.github.com/repos/lortmorris/universal-pattern/commits/7191bb3e528792ed43104fa134c381707d895a60';
      final = await getDirTreeByStep(tree, url.replace('/commits/', '/git/trees/'));
    }
    return tree;
  } catch (err)  {
    throw new Error(err);
  }
}
