import axios from 'axios';
export default class ApiServise {
  constructor() {
    this.searchImg = '';
    this.page = 1;
  }

  async getImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '31897410-2ad942b2553f3b748c6dbcf15';
    const params = {
      key: `${KEY}`,
      q: `${this.searchImg}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${this.page}`,
      per_page: 40,
    };

    this.page += 1;
    return await axios.get(`${BASE_URL}`, { params });
  }

  get startPage() {
    return this.page;
  }

  set startPage(start) {
    this.page = start;
  }
}
