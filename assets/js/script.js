//establishing global variable to capture city
const key = "61195d63fc2d44b9b418583d71cc1326";
//apiURL will need to append currentCity anf key
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// 5 day forecast url will need to append lat, long and key
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=";
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
        });
      }
    });
  }
}

//api fetch forecast data
function getForecast() {
  //fetch forecast
  var url2 =
    forecastURL + lat + "&lon=" + long + "&cnt=5&units=imperial&appid=" + key;
  console.log(url2);
  fetch(url2)
  .then(function (response) {
      //error handling not needed since valid data is being passed from getWeather()
      return response.json().then(function (data) {
        //passing data into weather info for storage
        forecastInfo = { data };
        //console.log(forecastInfo.data);
        forecast = forecastInfo.data.list;
        // console.log(forecast);
        //building forcast cards
        displayForecast(forecast);
      })
    });
}

function displayWeather() {
  //pulling out the data i need
  let temperature = weatherInfo.data.main.temp;
  let city = weatherInfo.data.name;
  let icon = weatherInfo.data.weather[0].icon;
  let humidity = weatherInfo.data.main.humidity;
  let windspeed = weatherInfo.data.wind.speed;
  let currentDate = new Date().toISOString().slice(0, 10);
  let iconLink =
    "<img src='http://openweathermap.org/img/w/" + icon + ".png' />";
  // Generating button
  card.classList = "visible";
  cityName.classList = "cityName";
  cityName.innerHTML = city + iconLink + " (" + currentDate + ")";
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

function displayForecast(fc) {
  console.log(fc);
  let forecastDisplay = document.getElementById("forecast");
  let forecastCardHolder = document.createElement("div");
  let forecastCard = document.createElement("div");
  let forecastList = document.createElement("div");
  

  //for loop to create 5 day forecast cards
  for (let i = 0; i < fc.length; i++) {
    forecastDisplay.innerHTML = "";
    let forecastIcon = fc[i].weather[0].icon;
    let forecastIconLink =
      "<img src='http://openweathermap.org/img/w/" + forecastIcon + ".png' />";
    let fcDate = fc[i].dt_txt;
    let fcTemp = fc[i].main.temp;
    let fcHum = fc[i].main.humidity;
    let fcWind = fc[i].wind.speed;
    // //Ul
    // let forecastListUl = document.createElement("ul");
    forecastList.classList.add("forecastData");
    forecastCard.appendChild(forecastList);
    // Date
    let ForecastDate = document.createElement("div");
    // ForecastDate.classList.add("forecastData");
    ForecastDate.textContent.innerHTML =
      "<span class='info'>" + fcDate + "</span>";
    forecastList.appendChild(ForecastDate);

    //icons
    let forecastIconImg = document.createElement("div");
    // forecastIconImg.classList.add("forecastData");
    forecastIconImg.innerHTML = forecastIconLink;
    forecastList.appendChild(forecastIconImg);

    // temp
    let forecastTemp = document.createElement("div");
    // forecastTemp.classList.add("forecastData");
    forecastTemp.innerHTML =
      "<span class='info'>Temp: " + Math.round(fcTemp) + " &#8457</span>";
    forecastList.appendChild(forecastTemp);

    // humidity
    let forecastHum = document.createElement("div");
    // forecastHum.classList.add("forecastData");
    forecastHum.innerHTML =
      "<span class='info'>Humidity: " + Math.round(fcHum) + "%</span>";
    forecastList.appendChild(forecastHum);
    //Wind
    let ForecastWind = document.createElement("div");
    // ForecastWind.classList.add("forecastData");
    ForecastWind.innerHTML =
      "<span class='info'>Wind: " + Math.round(fcWind) + " mph";
    forecastList.appendChild(ForecastWind);

    forecastCard.classList.add("forecastCard");
    forecastCardHolder.appendChild(forecastList);
    forecastDisplay.appendChild(forecastCardHolder);
  }
}

function recentSearches(cl) {
  let history = document.getElementById("recent");
  let historyList = document.createElement("div");
  let historyButton = document.createElement("button");
  //using foreach to loop through current city array and generate button
  cityHistory.forEach((location) => {
  //clear old buttons and only display buttons in the current array.
  historyButton.innerHTML="";
  //appending to button
  historyButton.textContent = location;
  //adding existing bootstrap styling
  historyButton.classList.add("historyBtn");
  historyList.appendChild(historyButton);
  history.appendChild(historyList);
})
  historyButton.addEventListener("click", getWeather);
}
searchBtn.addEventListener("click", getWeather);
