import {
  config
} from './config.js';
//Time constants
const hours_in_day = 24;

const minutes_in_hour = 60;
const seconds_in_minute = 60;
const milli_in_second = 1000;

//Location and weather vars
let lat = 0;
let lng = 0;
let currentHour = 0;
const apiKey = config.WEATHER_KEY;
let wString = "";


function currentTime() {
  //Clock section
  let date = new Date();
  let hour = updateTime(date.getHours());
  let minute = updateTime(date.getMinutes());
  let second = updateTime(date.getSeconds());
  let milli = date.getMilliseconds();
  let t = setTimeout(function() {
    currentTime();
  }, 1000);

  if (minute == '00' && second == '05') {
    fetchData(wString);
  }

  currentHour = hour;
  document.getElementById("clock").innerHTML = hour + " : " + minute + " : " + second;

  function updateTime(k) {
    if (k < 10) {
      return "0" + k;
    } else {
      return k;
    }
  }

  //Bar section
  var x = document.getElementById("bar");
  x.style.width = ((minute / minutes_in_hour) * 100) + ((second / seconds_in_minute)) + "%";

}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

function geoSuccess(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  console.log("lat:" + lat + " lng:" + lng);

  wString = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lng}&appid=${apiKey}`;

  fetchData(wString);
}

function geoError() {
  alert("Geocoder failed.");
}

function fetchData(weatherString) {
  fetch(weatherString).then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    let time = new Date(data.current.dt * 1000);
    let hour = time.getHours();
    let min = time.getMinutes();

    console.log("hour: " + hour);
    console.log("minute: " + min);

    const neededInfo = {
      temp: data.current.temp,
      feels_like: data.current.feels_like,
      wind_speed: data.current.wind_speed,
      wind_deg: data.current.wind_deg
    };

    let weatherEntries = Object.entries(neededInfo);

    console.log(neededInfo);

    let list = document.querySelector('#weather ul');

    //Steve-gregory's elegant answer to turn compass degrees to direction.
    //Obtained from stackoverflow
    function degToCompass(num) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      return arr[(val % 16)];
    }


    //create the list of weather values
    for (let [key, value] of weatherEntries) {
      let li = document.createElement('li');

      if (key === "wind_deg") {
        value = degToCompass(value);
      }
      li.textContent = `${key.toUpperCase()}: ${value}`;
      list.appendChild(li);
    }




  }).catch(e => {
    console.log(e);
  });
}

//####################List Section#######################

const list = document.querySelector('#task-list ul');

// add tasks
const addForm = document.forms['add-task'];
addForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // create elements
  const value = addForm.querySelector('input[type="text"]').value;
  const li = document.createElement('li');
  const bookName = document.createElement('span');
  const deleteBtn = document.createElement('span');

  // add text content
  bookName.textContent = value;
  deleteBtn.textContent = 'delete';

  // add classes
  bookName.classList.add('name');
  deleteBtn.classList.add('delete');

  // append to DOM
  li.appendChild(bookName);
  li.appendChild(deleteBtn);
  list.appendChild(li);
});

//Delete tasks
list.addEventListener('click', (e) => {
  if (e.target.className == 'delete') {
    const li = e.target.parentElement;
    li.parentNode.removeChild(li);
  }
})

currentTime();
getLocationWeather();