import React, {
  useState,
  useContext,
} from 'react';

import AppContext from '../../providers/AppContext';

function SearchAccount() {
  const [value, setValue] = useState('');
  const context = useContext(AppContext);
  const {
    _getReposByUsername,
  } = context;

  async function fetchRepose() {
    try {
      await _getReposByUsername(value);
    } catch (err) {
      alert('Error fetching repositories');
    }
  }
  return (
    <div>
      <input
        type="text"
        name="searchaccount"
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
      />
      <button onClick={() => fetchRepose()}>Get repos</button>
    </div>
  )
}

export default SearchAccount;
