const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAY = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
let clockCounter = 0;

const addButton = document.querySelector('.add-button');
const clockContainer = document.querySelector('.container');

//addButton.addEventListener('click', addClock)

function addClock() {
  clockCounter++
  clockContainer.appendChild(createElement(clockTemplate(clockCounter)))
}

function createElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

function clockTemplate(number) {
  return `<div class="wrapper">
  <div class="clock-container">
    <div class="clock">
      <div class="clock-face">
        <ul class="signs">
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
          <li class="hour-sign"></li>
        </ul>
        <ul class="arrows">
          <li class="dot"></li>
          <li class="second second-hand"></li>
          <li class="minute min-hand"></li>
          <li class="hour hour-hand"></li>
        </ul>
        <div class="digit-clock">
          <ul>
            <li class="time"></li>
            <li class="date"></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="city-container">
      <p class="city-name">Москва</p>
      <div class="input-field" hidden>
        <input type="text" name="city-input" placeholder="Введите город">
        <button type="button" class="search"></button>
      </div>
      <ul class="suggestions" hidden="false"></ul>
    </div>
    </div>
  </div>`
}

let utc = 3
function setTime() {
  const secondHand = document.querySelector('.second-hand');
  const minHand = document.querySelector('.min-hand');
  const hourHand = document.querySelector('.hour-hand');
  const digitTime = document.querySelector('.time');
  const digitDate = document.querySelector('.date')

  const now = new Date();

  const utcOffset = now.getTimezoneOffset() / 60;
  const newDate = new Date(
    now.getFullYear(), 
    now.getMonth(), 
    now.getDate(), 
    now.getHours() + (utcOffset + utc),
    now.getMinutes(), 
    now.getSeconds()
  )

  const seconds = newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds();
  const minutes = newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes();
  const hours = newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours();
  const date = newDate.getDate();
  const month = newDate.getMonth();
  const year = newDate.getFullYear();

  const secondHandPosition = (seconds / 60) * 360;
  const minHandPosition = (minutes / 60) * 360;
  const hourHandPosition = (hours / 12) * 360;

  secondHand.style.transform = `rotate(${secondHandPosition}deg)`
  minHand.style.transform = `rotate(${minHandPosition}deg)`
  hourHand.style.transform = `rotate(${hourHandPosition}deg)`

  digitTime.innerHTML = `${hours}:${minutes}:${seconds}`
  digitDate.innerHTML = `${date} ${MONTH[month]} ${year}`
}

addClock();

const hourSigns = document.querySelectorAll('.hour-sign');
hourSigns.forEach((hourSign, index) => hourSign.style.transform = `rotate(${30 * index}deg)`)

const inputField = document.querySelector('.input-field');
const input = document.querySelector('input')
const suggestions = document.querySelector('.suggestions');
const cityName = document.querySelector('.city-name');
const searchButton = document.querySelector('.search')

function hiddenToggle() {
  cityName.hidden = !cityName.hidden;
  inputField.classList.toggle('active')
  suggestions.hidden = !suggestions.hidden;
  suggestions.innerHTML = '';
  document.removeEventListener('click', focusOUT)
}

cityName.addEventListener('click', () => {
  hiddenToggle();
  input.focus();
})

function focusOUT(event) {
  const target = event.target;
  if (target.classList.contains('container') || target.tagName == 'HTML') {
    hiddenToggle();
  }
}

searchButton.addEventListener('click', displayMatches)
input.addEventListener('keydown', (e) => {
  if (e.code == 'Enter') {
    displayMatches();
  }
})
input.addEventListener('focusout', () => {
  document.addEventListener('click', focusOUT);
})

suggestions.addEventListener('click', selectCity)

const API_KEY = 'e983448d8ba240cea1771e32e1f7f674'
const API_URL = 'https://api.opencagedata.com/geocode/v1/json?q='

function makeFetchURL(city) {
  return `${API_URL}${city}&key=${API_KEY}&language=ru&pretty=1`;
}

let cityList = []
async function displayMatches() {
  const city = input.value; 
  let html = ''
  if (!city) {
    html = `<li>Введите название города</li>`
  }
  else {
    cityList = await getCitiesList(city);
    html = cityList.map(place => {
      return `<li>${place.cityName}</li>`;
    }).join('');
  }
  suggestions.innerHTML = html;
}

async function getCitiesList(city) {
  const promise = await fetch(makeFetchURL(city));
  const response = await promise.json();
  const data = await response.results.filter(item => item.components._type == 'city');
  const formattedData = await data.map(item => {
    let obj = {};
    obj.cityName = item.formatted;
    obj.timeZone = item.annotations.timezone.offset_string;
    return obj;
  })
  return formattedData;
}

function selectCity(event) {
  const target = event.target.closest('li');
  if (!target || target.textContent == "Введите название города") return;
  const timezone = cityList.find(item => item.cityName == target.textContent)['timeZone'].slice(0,3);
  utc = parseInt(timezone)
  cityName.textContent = target.textContent.split(',')[0];
  hiddenToggle();
}

setInterval(setTime, 1000);