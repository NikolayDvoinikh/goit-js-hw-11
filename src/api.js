import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31897410-2ad942b2553f3b748c6dbcf15';

export async function getImages(searchImg) {
  try {
    const resp = await axios.get(`${BASE_URL}`, {
      params: {
        key: `${KEY}`,
        q: `${searchImg}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log(resp.data);
    return resp.data;
  } catch (err) {
    console.log(err);
  }
}
