import { getImages } from './api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs.js';

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  const searchImages = searchQuery.value;
  console.dir(searchImages);

  getImages(searchImages).then(data => {
    refs.gallery.insertAdjacentHTML('beforeend', renderImages(data.hits));
    new SimpleLightbox('div.gallery a', {
      captionsData: 'alt',
      captionsDelay: 250,
    });
  });
}

function renderImages(items) {
  // itemsList = items;
  return items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `          
            <div class="photo-card">
              <a href="${largeImageURL}">  
                <img
                  src="${webformatURL}" 
                  alt="${tags}"
                  width="300"
                  loading="lazy" 
                />
              </a>
              <div class="info">
                <p class="info-item">
                  <b>Likes:<br>${likes}</b>
                </p>
                <p class="info-item">
                  <b>Views:<br>${views}</b>
                </p>
                <p class="info-item">
                  <b>Comments:<br>${comments}</b>
                </p>
                <p class="info-item">
                  <b>Downloads:<br>${downloads}</b>
                </p>
              </div>
            </div>            
          `;
      }
    )
    .join('');
}

// Плавная прокрутка страницы
// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
