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
  removeClassVisibleBtn();
  try {
    const {
      data: { hits, totalHits },
      config: {
        params: { page, per_page },
      },
    } = await apiServise.getImages();
    refs.gallery.insertAdjacentHTML('beforeend', renderImages(hits));
    lightBox.refresh();
    if (totalHits / per_page > page) {
      return visibleBtn();
    } else {
      removeClassVisibleBtn();
      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function onSubmitForm(e) {
  e.preventDefault();
  removeClassVisibleBtn();
  refs.gallery.innerHTML = '';
  apiServise.startPage = 1;
  e.target.elements[1].setAttribute('disabled', true);
  const {
    elements: { searchQuery },
  } = e.target;
  if (searchQuery.value.trim() === '') {
    e.target.elements[1].removeAttribute('disabled');
    return Notiflix.Notify.failure('Please type something...');
  }
  apiServise.searchImg = searchQuery.value.trim();

  try {
    const {
      data: { hits, totalHits },
      config: {
        params: { page, per_page },
      },
    } = await apiServise.getImages();

    if (hits.length === 0) {
      e.target.elements[1].removeAttribute('disabled');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      refs.gallery.insertAdjacentHTML('beforeend', renderImages(hits));
      lightBox.refresh();
      e.target.elements[1].removeAttribute('disabled');
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      if (totalHits / per_page > page) {
        return visibleBtn();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function removeClassVisibleBtn() {
  refs.addPhotoBtn.classList.remove('visible');
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
