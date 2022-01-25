import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import createCountryListItemMarkup from './templates/country-list__item.hbs';
import createCountryInfoMarkup from './templates/country-info.hbs';
import getCountryByName from './js/fetchCountries';
import './css/styles.css';

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
const onInputDebounced = debounce(onInput, DEBOUNCE_DELAY);

refs.search.addEventListener('input', onInputDebounced);

function onInput(e) {
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    updateCountriesUI();
    return;
  }
  getCountryByName(inputValue).then(onSuccess).catch(onError);
}
function onSuccess(countries) {
  if (countries.length === 1) {
    createCountryInfo(countries[0]);
    return;
  }
  if (countries.length > 10) {
    updateCountriesUI();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  createCountryList(countries);
}
function createCountryInfo(country) {
  const countryListItemMarkup = createCountryListItemMarkup(country);
  const countryInfoMarkup = createCountryInfoMarkup(country);
  updateCountriesUI(countryListItemMarkup, countryInfoMarkup);
}
function createCountryList(countries) {
  const countriesListMarkup = createCountriesListMarkup(countries);
  updateCountriesUI(countriesListMarkup);
}
function onError() {
  Notify.failure('Oops, there is no country with that name');
  updateCountriesUI();
}
function createCountriesListMarkup(array) {
  return array.map(createCountryListItemMarkup).join('');
}
function updateCountriesUI(listMarkup = '', infoMarkup = '') {
  updateCountryListUI(listMarkup);
  updateCountryInfoUI(infoMarkup);
}
function updateCountryListUI(markup) {
  refs.list.innerHTML = markup;
}
function updateCountryInfoUI(markup) {
  refs.info.innerHTML = markup;
}
