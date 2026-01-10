import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */

export const signInWithPassword = async ({ email, password, rememberMe }) => {
  try {
    const params = { email, password, rememberMe };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

// export const signInWithPassword = async ({ email, password, rememberMe }) => {
//   try {
//     const params = { email, password, rememberMe };

//     const res = await axios.post(endpoints.auth.signIn, params);

//     const token  = res.data.token;

//     if (!token) {
//       throw new Error('Access token not found in response');
//     }

//     setSession(token);
//   } catch (error) {
//     console.error('Error during sign in:', error);
//     throw error;
//   }
// };

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export const forgotPassword = async ({ email}) => {
  try {
    const body  = { email };

    const res = await axios.post(endpoints.auth.forgotPassword, body );

    return res.data;
  } catch (error) {
    console.error('Error during reset password:', error);
    throw error;
  }
};

export const newPassword = async ({ token, newPass, confirmPass }) => {
  try {
    const body  = { "newPassword": newPass, "confirmPassword": confirmPass };

    const res = await axios.post(endpoints.auth.newPassword(token), body );

    return res.data;
  } catch (error) {
    console.error('Error during changing password:', error);
    throw error;
  }
};