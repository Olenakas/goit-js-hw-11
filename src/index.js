import { refs } from './js/refs';
import { renderPicture, clearResults } from './js/rendering';
import { fetchPictures } from './js/api';
import Notiflix from 'notiflix';

refs.input.addEventListener('submit', onSubmit);
refs.btn.addEventListener('click', onLoadMore);

let searchQuery = '';
let currentPage = 1;

async function onLoadMore() {
  currentPage += 1;
  try {
    const { hits, totalHits } = await fetchPictures(searchQuery, currentPage);
    renderPicture(hits);
    if (hits.length < 40) {
      hideButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.warning(`Warning! ${error.message}`);
  }
}

async function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  clearResults();
  searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();
  if (searchQuery === '') {
    hideButton();
    return Notiflix.Notify.info(
      'Please, enter the information you are looking for.'
    );
  }

  try {
    const { hits, totalHits } = await fetchPictures(searchQuery, currentPage);
    if (hits.length === 0) {
      hideButton();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.info(`Hooray! We've found ${totalHits} images.`);
    renderPicture(hits);
    if (hits.length < 40) {
      hideButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      showButton();
    }
  } catch (error) {
    hideButton();
    Notiflix.Notify.warning(`Warning! ${error.message}`);
  }
}

function showButton() {
  refs.btn.classList.remove('is-hidden');
}
function hideButton() {
  refs.btn.classList.add('is-hidden');
}
