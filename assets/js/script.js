//establishing global variable to capture city
const key = "61195d63fc2d44b9b418583d71cc1326";
//apiURL will need to append currentCity anf key
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// 5 day forecast url will need to append lat, long and key
const forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";
let currentCity = "";
let forecast = [];
let cityHistory = [];
let lat = ""; //38.4666 - 121.3177;
let long = "";
const searchBtn = document.getElementById("search");
//current weather elements
let card = document.getElementById("toggle");
let cityName = document.getElementById("cityName");
let temp = document.getElementById("temp");
let hum = document.getElementById("hum");
let wind = document.getElementById("wind");

//api fetch weather data
function getWeather() {
  event.preventDefault();
  let currentCity = document.querySelector("input").value;
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
          displayWeather();
          getForecast();
          //clearing form input field
          document.getElementById("floatingInput").value = "";
        });
      }
    });
  }
}

//api fetch forecast data
function getForecast() {
  //fetch forecast
  var url2 =
    forecastURL +
    lat +
    "&lon=" +
    long +
    "&cnt=5&units=imperial&exclude=minutely,hourly&appid=" +
    key;
  console.log(url2);
  fetch(url2).then(function (response) {
    //error handling not needed since valid data is being passed from getWeather()
    return response.json().then(function (data) {
      //passing data into weather info for storage
      forecastInfo = { data };
      //console.log(forecastInfo);
      //Pulling out 5 day forecast
      forecast = forecastInfo.data.daily;
      //console.log(forecast);
      //building forcast cards
      displayForecast(forecast);
    });
  });
}

function displayWeather() {
  //pulling out the data i need
  let temperature = weatherInfo.data.main.temp;
  let city = weatherInfo.data.name;
  let icon = weatherInfo.data.weather[0].icon;
  let humidity = weatherInfo.data.main.humidity;
  let windspeed = weatherInfo.data.wind.speed;
  let currentDate = new Date().toLocaleDateString("en-US");
  let iconLink =
    "<img src='https://openweathermap.org/img/w/" + icon + ".png' />";
  // Generating button
  card.classList = "visible";
  cityName.classList = "cityName";
  cityName.innerHTML = city + iconLink + " " + currentDate;
  temp.innerHTML =
    "<span class='info'>Temp: " + Math.round(temperature) + " &#8457</span>";
  hum.innerHTML = "<span class='info'>humidity: " + Math.round(humidity) + "%";
  wind.innerHTML = "<span class='info'>Wind: " + Math.round(windspeed) + " mph";
  //using indexOf method to check if city already exist in array
  let index = cityHistory.indexOf(city);
  if (index === -1) {
    cityHistory.push(city);
    storeCities();
    recentSearches(city);
  } else {
    console.log("city already exist in your search history!");
  }
}

function displayForecast(fc) {
  //console.log(fc);
  let forecastCardHolder = document.getElementById("forecastCardHolder");
  let forecastCard = document.createElement("div");

  //for loop to create 5 day forecast cards starting the day after current weather
  for (let i = 1; i < 6; i++) {
    forecastCardHolder.innerHTML = "";
    let forecastIcon = fc[i].weather[0].icon;
    let forecastIconLink =
      "<img src='https://openweathermap.org/img/w/" + forecastIcon + ".png' />";
    let fcDate = fc[i].dt;
    let convertedFcDate = new Date(fcDate * 1000);
    let fcTemp = fc[i].temp.day;
    let fcHum = fc[i].humidity;
    let fcWind = fc[i].wind_speed;
    //console.log(fcDate);
    //Card
    forecastCardHolder.appendChild(forecastCard);
    forecastCardHolder.classList.add("forecastCardHolder");
    forecastCard.classList.add("forecastCard");

    // Create div to hold card data;
    let forecastInfo = document.createElement("div");
    forecastInfo.classList.add("forecastData");
    forecastCard.appendChild(forecastInfo);

    // Date
    let forecastDate = document.createElement("p");
    // ForecastDate.classList.add("forecastData");
    forecastDate.innerHTML =
      "<span class='info'>" +
      convertedFcDate.toLocaleDateString("en-US") +
      "</span>";
    forecastInfo.appendChild(forecastDate);

    //icons
    let forecastIconImg = document.createElement("p");
    // forecastIconImg.classList.add("forecastData");
    forecastIconImg.innerHTML = forecastIconLink;
    forecastInfo.appendChild(forecastIconImg);

    // temp
    let forecastTemp = document.createElement("p");
    // forecastTemp.classList.add("forecastData");
    forecastTemp.innerHTML =
      "<span class='info'>Temp: " + Math.round(fcTemp) + " &#8457</span>";
    forecastInfo.appendChild(forecastTemp);

    // humidity
    let forecastHum = document.createElement("p");
    // forecastHum.classList.add("forecastData");
    forecastHum.innerHTML =
      "<span class='info'>Humidity: " + Math.round(fcHum) + "%</span>";
    forecastInfo.appendChild(forecastHum);
    //Wind
    let ForecastWind = document.createElement("p");
    // ForecastWind.classList.add("forecastData");
    ForecastWind.innerHTML =
      "<span class='info'>Wind: " + Math.round(fcWind) + " mph";
    forecastInfo.appendChild(ForecastWind);

    // let cardEnd = document.createElement("div");
    // forecastInfo.appendChild(cardEnd);
  }
}

function recentSearches(cl) {
  //console.log(cl);
  let history = document.getElementById("recent");
  let historyList = document.createElement("div");
  let historyButton = document.createElement("button");
  //using foreach to loop through current city array and generate button
  cityHistory.forEach((location) => {
    //clear old buttons and only display buttons in the current array.
    historyButton.innerHTML = "";
    //appending to button
    historyButton.textContent = location;
    //adding existing bootstrap styling
    historyButton.classList.add("historyBtn");
    historyList.appendChild(historyButton);
    history.appendChild(historyList);

    historyButton.addEventListener("click", function () {
      //updating form input with recent search city before calling getWeather() which will use that value in fetch call
      document.getElementById("floatingInput").value = location;
      getWeather();
      // console.log(cityHistory);
    });
  });
}

//storing search history using local storage
function storeCities() {
  localStorage.setItem("searches", JSON.stringify(cityHistory));
}

function loadSearches() {
  let searches = localStorage.getItem("searches");
  // console.log(searches);
  if (!searches) {
    cityHistory = [];
    //console.log("empty");
  } else {
    searchedCities = JSON.parse(searches);
    //console.log(typeof searchedCities);
    //the Json item retrieved from local storage comes back as an object so used Object.values to create an array of values to pass to recentSearches()
    cityHistory = Object.values(searchedCities);
    //console.log(cityHistory);
    cityHistory.forEach((element) => {
      searchedCity = element;
      // console.log(searchedCity);
      recentSearches(searchedCity);
    });
    //local storage is working having issues loading button on page i am able to pass the the argument to the function but buttons are not being generated correctly. All button have text.content of the last city in array
  }
}

searchBtn.addEventListener("click", getWeather);
//loadSearches();
