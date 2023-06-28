import { fetchImages } from './api';
import Notiflix from 'notiflix';

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
let requestUrl = '';

async function handleFormSubmit(event) {
  event.preventDefault();
  currentQuery = refs.input.value.trim();
  currentPage = 1;

  clearGallery();
  await fetchDataBySearch();
}

async function fetchDataBySearch() {
  requestUrl = getRequestUrl(currentQuery, currentPage);

  try {
    const data = await fetchImages(requestUrl);
    checkFetchResultBeforeRender(data);
  } catch (error) {
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

function checkFetchResultBeforeRender(data) {
  const { hits, totalHits } = data;
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    hideLoadMoreButton();
  } else {
    makeMarkup(hits);
    if (currentPage * PER_PAGE <= totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      Notiflix.Notify.info("You've reached the end of search results.");
    }
  }
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

async function loadMoreImages() {
  currentPage += 1;
  await fetchDataBySearch();
}

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

const fff = 2;
