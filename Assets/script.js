var APIKey = "2ddb14814bcbe05573b3e39270b994a1";
var city;
userCities =[];
var lat;
var lon;


function getApi() {
//search a city 
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=2ddb14814bcbe05573b3e39270b994a1";

    fetch(requestUrl)
      .then(function (response){
          return response.json();
      })
      .then(function (data) {
        console.log(data);
          for(var i = 0; i < userCities.length; i++) {
              $("#cities").append()            
          }
      })
      .then(function (data) {
//put it into local storage 
//parse out the data in order for it to be used for the lat and lon 
        const json = JSON.parse(data);
        console.log(json);
       
      })
      .catch (function() {
        //   catch any errors
      });

      }

    //   getApi();
// City array from local storage.
function loadCities(){
    var citiesStr = localStorage.getItem("cities");
    if(citiesStr != null) {
        userCities = JSON.parse(citiesStr);
    }
    // iterate through array, building divs for each city
    for(var i = 0; i < userCities.length; i++){
        $("#cities").append(buildCityDiv(userCities[i]));
    }

}
function buildCityDiv(city){
    var newDiv = $("<div>");
    newDiv.text(city);
    newDiv.attr("id", city);
    newDiv.attr("class", "city-div");
    return newDiv;
}

function displayCityData(city){
    $("#city-name").text(city);
    // showWeather(city);
    showForecast(city);
}


function showWeather(lat, lon) {
    // adding another parameter after the query parameter
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q={" + city + "&units=imperial&appid=" + APIKey;
    //new fnction using this api to get the information for the weather forecast 
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon + "&appid="+ APIKey;

    fetch(
    
        queryURL
   

    ).then(function(res){
        return res.json()
    })
    .then(function(response) {
        console.log(response);
        
  
        // clear error text on successful call
        $("#help-text").text(""); 
        $("#current-temp").text("Temperature: " + parseInt(response.daily[0].temp.max) + "F");
        $("#current-humidity").text("Humidity: " + response.daily[0].humidity + "%");
        $("#current-wind").text("Wind Speed: " + parseInt(response.daily[0].wind.speed) + " MPH");

        var date = moment.unix(response.dt);
        var dateStr = date.format("M/DD/YYYY");
        $("current-date").text(dateStr);

        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
        $("#current-icon").attr("src", iconURL);
        $("#current-icon").attr("alt", "weather icon");

        var bgURL = getBgURL(icon);
        $("#current-bg").attr("src", bgURL);
        $("#current-bg").attr("alt", "weather backgraound image");

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        fetch({
            url: queryURL,
            method: "GET",
            error: function(){
                console.log("UV Index call failed");               
            }
        }).then(function(response){
            var uvIndex = response.value;
            var uvColor = "";
            if (uvIndex < 3){uvColor = "green";}
            else if(uvIndex < 6){uvColor = "yellow";}
            else if(uvIndex < 8){uvColor = "orange";}
            else if(uvIndex < 11){uvColor = "red";}
            else{ uvColor = "violent";}
            $("#uv-label").text("UV Index: ");
            $("#current-uv").text(uvIndex);
            $("#current-uv").attr("style", "background-color: " + uvColor);
        });
    });
}
function showForecast(city) {
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(
      
        queryURL
   
    ).then(function(res){
        return res.json()
    })
    .then(function(response){
        console.log(response);
        showWeather(response.city.coord.lat, response.city.coord.lon);
    });
}

function addCity(city) {
    // find existing city and remove from DOM and array
    for(var i = 0; i < userCities.length; i++){
        if(userCities[i] === city) {
            $("#" + city).remove();
            userCities.splice(i, 1);
        }
    }

    // add city to front of array
    userCities.splice(0, 0, city);

    // newDiv and prepend to DOM
    newDiv = buildCityDiv(city);
    $("#cities").prepend(newDiv);

    // save updated user cities array to local storage
    storeCities();
}
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(userCities));
}

    $("#city-submit").on("click", function(){
        event.preventDefault();
        var city = $("#city-input").val();
        // to clear input field
        $("#city-input").val("");
        
        if(city !== ""){
            addCity(city);
            displayCityData(city);

        }
    });

 

