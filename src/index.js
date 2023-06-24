import Notiflix from 'notiflix';
const axios = require('axios').default;
import { apiKey } from './credentials';

const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  sbmtBtn: document.querySelector('[type="submit"]'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', getRequestUrl);

function getRequestUrl(event) {
  event.preventDefault();
  let searchValue = refs.input.value;
  let requestUrl = `${BASE_URL}?key=${apiKey}&page=1&per_page=40&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`;
  getImagesBySearch(requestUrl);
}

async function getImagesBySearch(requestUrl) {
  try {
    const response = await axios.get(requestUrl);
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      makeMarkup(images);
    }
  } catch (error) {
    console.error(error);
  }
}

function makeMarkup(images) {
  const markup = images
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
        return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div>`;
      }
    )
    .join('');
  refs.gallery.innerHTML = markup;
  refs.loadMoreBtn.style.display = 'block';
}
