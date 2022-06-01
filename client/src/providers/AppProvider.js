import React, {
  useState,
  useMemo,
} from 'react';

import { AppProvider } from './AppContext';
import {
  getReposByUsername,
  getLastCommit,
  getDirTreeFromRepo,
} from '../lib/github';

function AppProviderContext({ children, token }) {
  const [currentAccount, setCurrentAccout] = useState();
  const [currentRepos, setCurrentRepos] = useState([]);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentLastCommit, setCurrentLastcommit] = useState();


  async function _getReposByUsername(username) {
    try {
      setCurrentAccout(username);
      const repos = await getReposByUsername(username);
      setCurrentRepos(repos);
    } catch(err) {
      console.error('Error: ', err);
    }
  }

  async function _getLastCommit(repository) {
    try {
      const lastCommit = await getLastCommit(currentAccount, repository);
      setCurrentLastcommit(lastCommit);
    } catch(err) {
      console.error('Error: ', err);
    }
  }

  async function _getDirTreeFromRepo() {
    try {
      const tree = await getDirTreeFromRepo(currentLastCommit);
      setCurrentFiles(tree);
    } catch (err) {
      console.error('Error getting treefiles: ', err);
    }
  }

  const values = useMemo(
  () => ({
    currentAccount,
    currentRepos,
    currentFiles,
    _getReposByUsername,
    _getLastCommit,
    _getDirTreeFromRepo,
  }),
  [
    currentAccount,
    currentRepos,
    currentFiles,
    currentLastCommit,
  ],
);



  return (
    <AppProvider
      value={values}
    >
      {children}
    </AppProvider>
  );
}

export default AppProviderContext;
