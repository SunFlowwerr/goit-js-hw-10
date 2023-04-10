import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(searchFunc, DEBOUNCE_DELAY));

function searchFunc(e) {
  e.preventDefault();
  const country = searchBox.value.trim();
  if (country) {
    return fetchCountries(country).then(result).catch(error);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function result(countries) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countries.length >= 2 && countries.length <= 10) {
    countryInfo.innerHTML = createCountries(countries);
  }
  if (countries.length === 1) {
    countryInfo.innerHTML = createCountry(countries);
  }
}

function createCountry(countries) {
  return countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" alt="Flag of ${
        name.official
      }" width="40px" heigth="auto"> ${name.official}</h1>
        <p><b>Capital</b>: ${capital}</p>
        <p><b>Population</b>: ${population}</p>
        <p><b>Languages</b>: ${Object.values(languages)}</p>`;
    })
    .join('');
}

function createCountries(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" width="40px" heigth="auto"><p>${name.official}</p></li>`;
    })
    .join('');
}

function error() {
  return Notify.failure('Oops, there is no country with that name');
}
