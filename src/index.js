// Import

import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import Notiflix from 'notiflix';

// Refs

const searchForm = document.querySelector('.search-form');
const submitButton = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const footerSection = document.querySelector('.footer');
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

// API Pixabay//

const PIXABAY_URL = 'https://pixabay.com/api/';
const PIXABAY_KEY = '36943065-ff881c8bb0ed0c603526164e9';
const PER_PAGE = 40;
let currentPage = 1;

searchForm.addEventListener('input', event => {
  const searchValue = event.target.value;
  localStorage.setItem('search-term', searchValue.trim());
});

submitButton.addEventListener('click', event => {
  event.preventDefault();
  const saveSearch = localStorage.getItem('search-term');
  if (saveSearch === null || saveSearch === '') {
    Notiflix.Notify.failure('Please type something in the search input.');
    return;
  }
  currentPage = 1;
  fetchImages(saveSearch, currentPage);
});

const fetchImages = async (searchValue, currentPage) => {
  let galleryMarkup = '';
  const params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });
  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );

    const arrayImages = response.data.hits;
    const totalHits = response.data.totalHits;

    if (arrayImages.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    btnLoadMore.style.display = 'block';
    footerSection.style.display = 'flex';

    //   Markup

    galleryMarkup = arrayImages
      .map(image => {
        return ` <div class ="cards"> 
 <div class = "photo">
 </div>
  <a href="${image.largeImageURL}" class="l"lightbox">   
<img class ="image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
    </div>
  </div>
</div>`;
      })
      .join('');

    gallery.innerHTML = galleryMarkup;
    lightbox.refresh();

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.log(error);
  }
};

const fetchNewImage = async (searchValue, currentPage) => {
  let galleryMarkup = '';
  let params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });

  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );
    const arrayImages = response.data.hits;

    if (arrayImages.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    galleryMarkup = arrayImages
      .map(image => {
        return `
        
 <div class ="cards"> 
 <div class = "photo">
 </div>
 <a href="${image.largeImageURL}" class="l"lightbox">   
<img class ="image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
    </div>
  </div>
</div>`;
      })
      .join('');

    gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .lastElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
  }
};

btnLoadMore.addEventListener('click', async () => {
  const searchValue = localStorage.getItem('search-term');
  currentPage++;
  let params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });
  lightbox.refresh();

  try {
    const response = await axios.get(
      `${PIXABAY_URL}?${params}&page=${currentPage}`
    );

    const imagesPerPage = PER_PAGE;

    const totalImages = response.data.totalHits;
    const maxPageNumber = totalImages / imagesPerPage;
    const maxPageNumberRound = Math.ceil(maxPageNumber);
    console.log('currentPage: ', currentPage);
    console.log('maxPageNumber: ', maxPageNumber);
    console.log('maxPageNumberRound: ', maxPageNumberRound);

    if (currentPage === maxPageNumberRound) {
      footerSection.style.display = 'none';
      btnLoadMore.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    fetchImages(searchValue, currentPage);
  } catch (error) {
    console.error(error);
  }
});

footerSection.style.display = 'none';
btnLoadMore.style.display = 'none';
