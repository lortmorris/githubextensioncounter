import React, {
  useState,
} from 'react';

function SearchAccount() {
  const [value, setValue] = useState('');
  return (
    <div>
      <input
        type="text"
        name="searchaccount"
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
      />
    </div>
  )
}

export default SearchAccount;
