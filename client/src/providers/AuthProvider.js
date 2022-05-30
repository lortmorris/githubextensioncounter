import React, {
  useState,
  useEffect,
} from 'react';

import { AuthProvider } from './AuthContext';

import { getMyProfile } from '../libs/users';

function AppProviderContext({ children, token }) {
  const [data, setData] = useState({
    token,
    userData: null,
    drawerOpened: true,
  });

  async function fetchUserData() {
    try {
      if (!token) return;
      const userData = await getMyProfile(token);
      setData({
        ...data,
        userData,
      });
    } catch (err) {
      console.info('Error fetch store data: ', err);
    }
  }

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  return (
    <AuthProvider
      value={{
        ...data,
        setToken: (value) => setData({
          ...data,
          token: value,
        }),
        setSessionData: (newToken, newUserData) => {
          setData({
            token: newToken,
            userData: newUserData,
          });
        },
        logout: () => {
          sessionStorage.removeItem('x-access-token');
          setData({
            token: null,
            userData: null,
          });
        },
      }}
    >
      {children}
    </AuthProvider>
  );
}

export default AppProviderContext;
