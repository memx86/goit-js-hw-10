import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryListMarkup from './templates/country-list__item.handlebars';
import countryMarkup from './templates/country-info.handlebars';
import './css/styles.css';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const onInputDebounced = debounce(onInput, DEBOUNCE_DELAY);

refs.search.addEventListener('input', onInputDebounced);

function onInput(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    return;
  }
  fetchCountryByName(inputValue).then(onFetchSuccess).catch(onError);
}
function fetchCountryByName(country) {
  const url = `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(r => r.json());
}
function onFetchSuccess(countries) {
  if (countries.length === 1) {
    createCountryInfo(countries[0]);
    return;
  }
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  createCountryList(countries);
}
function createCountryInfo(country) {
  refs.list.innerHTML = countryListMarkup(country);
  refs.info.innerHTML = countryMarkup(country);
}
function createCountryList(countries) {
  const countriesMarkup = countries.map(countryListMarkup).join('');
  refs.list.innerHTML = countriesMarkup;
}
function onError(e) {
  Notify.failure('Oops, there is no country with that name');
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
