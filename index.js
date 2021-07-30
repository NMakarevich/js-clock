import TIMEZONES from "./TIMEZONES.js"
const MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAY = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
let clockCounter = 0;

const addButton = document.querySelector('.add-button');
const clockContainer = document.querySelector('.clock-container');

function findMatches(wordToMatch) {
  return TIMEZONES.filter(place => place.city.toLowerCase().slice(0, wordToMatch.length) == wordToMatch.toLowerCase());
}

function displayMatches() {
  const matchArray = findMatches(this.value);
  const html = matchArray.map(place => {
    return `<li>${place.city}</li>`;
  }).join('');
  suggestions.innerHTML = html;
}

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
      <input type="text" name="" hidden>
      <ul class="suggestions" hidden="false"></ul>
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

const input = document.querySelector('input');
const suggestions = document.querySelector('.suggestions');
const cityName = document.querySelector('.city-name');

function hiddenToggle() {
  cityName.hidden = !cityName.hidden;
  input.hidden = !input.hidden;
  suggestions.hidden = !suggestions.hidden;
  suggestions.innerHTML = '';
  document.removeEventListener('click', focusOUT)
}

cityName.addEventListener('click', () => {
  hiddenToggle();
  input.value = cityName.textContent;
  input.focus();
})

function focusOUT() {
  hiddenToggle();
}

input.addEventListener('input', displayMatches)
input.addEventListener('focusout', () => {
  document.addEventListener('click', focusOUT);
})

suggestions.addEventListener('click', selectCity)

function selectCity(event) {
  const target = event.target.closest('li');
  if (!target) return;
  input.value = target.textContent;
  utc = TIMEZONES.find(item => item.city == input.value)['UTC'];
  cityName.textContent = input.value;
  hiddenToggle();
}

setInterval(setTime, 1000);