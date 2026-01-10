import axios from 'axios';
// this is used for new transaction for demo purpose
export const fakeTransactionPostV = async (values) => {
  try {
    const res = await axios.post('https://jsonplaceholder.typicode.com/posts', values);

    return res.data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};
