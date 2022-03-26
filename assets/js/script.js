//establishing global variable to capture city
const key = "61195d63fc2d44b9b418583d71cc1326";
//apiURL will need to append currentCity anf key
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
// 5 day forecast url will need to append lat, long and key
const forecastURL = "api.openweathermap.org/data/2.5/forecast?lat=";
let cityHistory = [];
let lat = "";
let long = "";
// let weatherInfo = [];
const searchBtn = document.getElementById("search");

//api fetch weather data
function getWeather() {
  event.preventDefault();
  const currentCity = document.querySelector("input").value;
  //input validation
  if (currentCity === null || currentCity === "") {
    window.alert("Please enter a valid city");
  } else {
    console.log(currentCity);
    cityHistory.push(currentCity);
    let url = apiURL + currentCity + "&appid=" + key;

    //fetch weather
    fetch(url)
    .then(function (response) {
      //error handling if user enters an invalid city
      if(response.status === 404) {
        cityHistory = [];
        window.alert("Please enter a valid city");
      } else  {
      return response.json().then(function (data) {
        //passing data into weather info for storage
        weatherInfo = { data };
        // console.log(weatherInfo.data);
        lat = weatherInfo.data.coord.lat;
        long = weatherInfo.data.coord.lon;
        //all data is from api call is being stored accordingly
        getForecast();
      })
      }
    });
  }
}

//api fetch forecast data
function getForecast() {
  //verifying data is being transfered between both functions
  console.log(lat, long);
  console.log(cityHistory);
  console.log(weatherInfo.data);
  //fetch forecast
  let url2 = forecastURL + lat + "&lon=" + long + "&cnt=5&appid=" + key;
  console.log(url2);
  fetch(url2)
  // .then(function (response) {
  //     //error handling not needed since valid data is being passed from getWeather()
  //     return response.json().then(function (data) {
  //       //passing data into weather info for storage
  //       forecastInfo = { data };
  //       console.log(forecastInfo.data);
  //       //all data is from api call is being stored accordingly
  //       //constructor functions for the 
  //     })
  //   });
  };

searchBtn.addEventListener("click", getWeather);
