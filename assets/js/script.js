//establishing global variable to capture city
const key = "61195d63fc2d44b9b418583d71cc1326";
//apiURL will need to append currentCity anf key
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// 5 day forecast url will need to append lat, long and key
const forecastURL = "api.openweathermap.org/data/2.5/forecast?lat=";
let cityHistory = [];
let lat = ""; //38.4666 - 121.3177;
let long = "";
const searchBtn = document.getElementById("search");
let card = document.getElementById("toggle");
let cityName = document.getElementById("cityName");
let temp = document.getElementById("temp");
let hum = document.getElementById("hum");
let wind = document.getElementById("wind");

//dynamic HTML


//api fetch weather data
function getWeather() {
  event.preventDefault();
  const currentCity = document.querySelector("input").value;
  //input validation
  if (currentCity === null || currentCity === "") {
    window.alert("Please enter a valid city");
  } else {
    // console.log(currentCity);
    let url = apiURL + currentCity + "&units=imperial&appid=" + key;

    //fetch weather
    fetch(url).then(function (response) {
      //error handling if user enters an invalid city
      if (response.status === 404) {
        cityHistory = [];
        window.alert("Please enter a valid city");
      } else {
        return response.json().then(function (data) {
          //passing data into weather info for storage
          weatherInfo = { data };
          // console.log(weatherInfo.data);
          lat = weatherInfo.data.coord.lat;
          long = weatherInfo.data.coord.lon;
          
          //all data is from api call is being stored accordingly but getting Cors error on second call
          // getForecast();
          displayWeather();
           getForecast();
        });
      }
    });
  }
}

//api fetch forecast data
function getForecast() {
  //event.preventDefault();
  console.log("clicked");
  // console.log(cityHistory);
  // console.log(weatherInfo.data);
  //fetch forecast
  let url2 = forecastURL + lat + "&lon=" + long + "&cnt=5&appid=" + key;
  console.log(url2);
  fetch(url2)
  .then(function (response) {
      //error handling not needed since valid data is being passed from getWeather()
      return response.json().then(function (data) {
        //passing data into weather info for storage
        forecastInfo = { data };
        console.log(forecastInfo.data);
        //all data is from api call is being stored accordingly
        //constructor functions for the
      })
    });
}

function displayWeather() {
  // console.log(CityName);
  let card = document.getElementById("toggle");
  let cityName = document.getElementById("cityName");
  let image = document.getElementById("icon");
  let temp = document.getElementById("temp");
  let hum = document.getElementById("hum");
  let wind = document.getElementById("wind");
  console.log(weatherInfo.data);
  //pulling out the data i need
  let temperature = weatherInfo.data.main.temp;
  let city = weatherInfo.data.name;
  let icon = weatherInfo.data.weather[0].icon;
  let humidity = weatherInfo.data.main.humidity;
  let windspeed = weatherInfo.data.wind.speed;
  let date = new Date();
  let iconLink =
    "<img src='http://openweathermap.org/img/w/" + icon + ".png' />";
  //populating weather data
  // console.log(cityName)
  // console.log(iconLink, temperature, humidity, windspeed)
  // console.log(image, iconLink);
  card.classList = "visible";
  cityName.classList = "cityName";
  cityName.innerHTML = city + iconLink;
  temp.innerHTML =
    "<span class='info'>Temp: " + Math.round(temperature) + " &#8457</span>";
  hum.innerHTML = "<span class='info'>humidity: " + Math.round(humidity) + "%";
  wind.innerHTML = "<span class='info'>Wind: " + Math.round(windspeed) + " mph";
  //using indexOf method to check if city already exist in array
  let index = cityHistory.indexOf(city);
  if (index === -1) {
    cityHistory.push(city);
    recentSearches(city);
  } else {
    console.log('city already exist in your search history!')
  }
  
}

function recentSearches(cl) {
  let history = document.getElementById("recent");
  let historyList = document.createElement("div");
  let historyButton = document.createElement("button");
  console.log('we are here!')
  console.log(cl)
  console.log(cityHistory)
//using foreach to loop through current city array and generate button
cityHistory.forEach((location) => {
  console.log(historyList)
  //using jqurey to clear old buttons and only disply buttons in the current array.
  historyButton.innerHTML="";
  //appending to button
  historyButton.textContent = location;
  //adding existing bootstrap styling
  historyButton.classList.add("historyBtn");
  historyList.appendChild(historyButton);
  history.appendChild(historyButton);
  console.log(location);
  console.log(historyButton);
})
  historyButton.addEventListener("click", getWeather);
}
searchBtn.addEventListener("click", getWeather);
