import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryListMarkup from './templates/country-list__item.hbs';
import countryMarkup from './templates/country-info.hbs';
import './css/styles.css';

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const onInputDebounced = debounce(onInput, DEBOUNCE_DELAY);

refs.search.addEventListener('input', onInputDebounced);

function onInput(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearCountries();
    return;
  }
  getCountryByName(inputValue).then(onSuccess).catch(onError);
}
function getCountryByName(country) {
  const url = `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}
function onSuccess(countries) {
  if (countries.length === 1) {
    createCountryInfo(countries[0]);
    return;
  }
  if (countries.length > 10) {
    clearCountries();
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
  clearCountries();
  const countriesMarkup = countries.map(countryListMarkup).join('');
  refs.list.innerHTML = countriesMarkup;
}
function onError() {
  Notify.failure('Oops, there is no country with that name');
  clearCountries();
}
function clearCountries() {
  if (refs.list.innerHTML) refs.list.innerHTML = '';
  if (refs.info.innerHTML) refs.info.innerHTML = '';
}
