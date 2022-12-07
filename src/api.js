import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31897410-2ad942b2553f3b748c6dbcf15';

export async function getImages() {
  try {
    const resp = await axios.get(`${BASE_URL}${KEY}`);
    console.log(resp);
  } catch (err) {
    console.log(err);
  }
}

// async function getUser() {
//   try {
//     const response = await axios.get('/user?ID=12345');
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }
