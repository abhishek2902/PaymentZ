import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY, USER_NAME, USER_EMAIL, USER_ID, USER_ROLE } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);

      if (token && isValidToken(token)) {
        setSession(token);
        
        const res = await axios.get(endpoints.auth.me);

        const { username, id,role,email } = res.data;
        // set merchant id
        sessionStorage.setItem(USER_ID, id);
        sessionStorage.setItem(USER_NAME, username);
        sessionStorage.setItem(USER_EMAIL, email);
        sessionStorage.setItem(USER_ROLE, role);
        
        // const { user } = res.data;
        // setState({ user: { ...user, token }, loading: false });
        setState({ user: { username, id, role, email , token }, loading: false });
      } else {
        setState({ user: null, loading: false });

        sessionStorage.removeItem(USER_ID);
        sessionStorage.removeItem(USER_NAME);
        sessionStorage.removeItem(USER_EMAIL);
        sessionStorage.removeItem(USER_ROLE);
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
