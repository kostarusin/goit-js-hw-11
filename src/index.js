import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { apiKey } from './credentials';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  sbmtBtn: document.querySelector('[type="submit"]'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let currentPage = 1;
let currentQuery = '';

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();

  currentQuery = refs.input.value.trim();
  currentPage = 1;

  clearGallery();
  await fetchImages();
}

function getRequestUrl(query, page) {
  const url = new URL(BASE_URL);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('q', query);
  url.searchParams.append('image_type', 'photo');
  url.searchParams.append('orientation', 'horizontal');
  url.searchParams.append('safesearch', 'true');
  url.searchParams.append('page', page.toString());
  url.searchParams.append('per_page', PER_PAGE.toString());
  return url.toString();
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
        return `
        <a class="gallery__link" href="${largeImageURL}" target="_blank">
    <div class="photo-card">
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
    </div>
    </a>
      `;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreButton() {
  refs.loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  refs.loadMoreBtn.style.display = 'none';
}

function loadMoreImages() {
  currentPage += 1;
  fetchImages();
}
