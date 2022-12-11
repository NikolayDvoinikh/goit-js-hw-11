import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs.js';
import ApiServise from './api.js';
const lightBox = new SimpleLightbox('div.gallery a', {
  captionsDelay: 250,
});
const apiServise = new ApiServise();

refs.form.addEventListener('submit', onSubmitForm);
refs.btnLoadMore.addEventListener('click', loadMore);

async function loadMore() {
  refs.addPhotoBtn.classList.remove('visible');
  await apiServise.getImages().then(({ data, config }) => {
    refs.gallery.insertAdjacentHTML('beforeend', renderImages(data.hits));
    lightBox.refresh();
    if (data.totalHits / config.params.per_page > config.params.page) {
      return visibleBtn();
    } else {
      refs.addPhotoBtn.classList.remove('visible');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

async function onSubmitForm(e) {
  e.preventDefault();
  refs.addPhotoBtn.classList.remove('visible');
  refs.gallery.innerHTML = '';
  apiServise.startPage = 1;
  const {
    elements: { searchQuery },
  } = e.target;
  apiServise.searchImg = searchQuery.value.trim();

  await apiServise
    .getImages()
    .then(({ data, config }) => {
      if (data.hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (config.params.q === '') {
        return Notiflix.Notify.failure('Please type something...');
      } else {
        refs.gallery.insertAdjacentHTML('beforeend', renderImages(data.hits));
        lightBox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits / config.params.per_page > config.params.page) {
          return visibleBtn();
        }
      }
    })
    .catch(err => console.log(err));
}

function visibleBtn() {
  if (refs.addPhotoBtn.classList.contains('visible')) {
    return;
  }
  refs.addPhotoBtn.classList.add('visible');
}

function renderImages(items) {
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
