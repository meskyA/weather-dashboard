var APIKey = "2ddb14814bcbe05573b3e39270b994a1";
var city;
userCities =[];
var lat;
var lon;

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//pass the city variable thorugh here
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

      getApi();
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
    showWeather(city);
    showForecast(city);
}
// get URL
// function getBgURL(icon) {
//     var url = "";

//     switch(icon) {
//         case "01d":
//         case "01n":
//             url = "assets/images/clear_sky.jpg";
//             break;

//         case "02d"
//     }
// }

function showWeather(city) {
    // adding another parameter after the query parameter
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q={" + city + "&units=imperial&appid=" + APIKey;
    //new fnction using this api to get the information for the weather forecast 
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon="+ lon + "&appid="+ APIKey;

    fetch( {
        url: queryURL,
        method: "GET",
        error: function(){
            $("#city-name").text("City Not Found");
            $("help-text").text("City Not Found");
            $("#current-temp").text("");
            $("current-humidity").text("");
            $("current-wind").text("");
            $("current-date").text("");
            $("current-icon").attr("src", "");
            $("current-icon").attr("alt", "...");
            $("uv-label").text("");
            $("current-uv").text("");
            $("current-bg").attr("src", "assets/images/no_data.jpg");
            $("current-bg").attr("alt", "no weather image");
       }
    }).then(function(response) {
        
  
        // clear error text on successful call
        $("#help-text").text(""); 
        $("#current-temp").text("Temperature: " + presentInt(response.main.temp) + "F");
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + parseInt(response.wind.speed) + " MPH");

        var date = mement.unix(response.dt);
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

    $.fetch({
        url: queryURL,
        method: "GET",
        error: function(){
            for(var i = 0; i < 5; i++){
                // $("#forecast-temp-" = i).text("");
                $("#forecast-humidity-" + i).text("");
                // $("#forecast-date-" = i).text("");
                // $("#forecast-icon-" = i).attr("src", "");
                // $("#forecast-icon-" = i).attr("alt", "...");
                // $("#forecast-bg-" = i).attr("src", "assets/images/no_data.jpg");
                // $("#forecast-bg-" = i).attr("atr", "no weather image");
            }
            $("#carouselIndicatorsDiv").carousel(0);

        }
    }).then(function(response){
        for(var i = 0; i < 5; i++){
            timeIndex= i * 8 + 7;

            $("#forecast-temp-" + i).text("Temperature: " + parseInt(response.list[timeIndex].main.temp) + "F");
            $("#forecast-huminity-" + i).text("Huminity: ") + response.list[timeIndex].main.humidity + "%";
            var date = moment.unix(response.list[timeIndex].dt);
            var dateStr = date.format("MM/DD/YYYY");
            $("#forecast-date-" + i).text(dateStr);
            var icon = response.list[timeIndex].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn" + icon + "@2x.png";
            $("#forcast-icon-" + i).attr("src", iconURL);
            $("#forcast-icon-" + i).attr("alt", "weather icon");

            var bgURL = getBgURL(icon);
            $("#forecast-bg-" + i).attr("src", bgURL);
            $("#forecast-bg-" + i).attr("alt", "weather background image");
            
        }

        $("#carouselIndicatorsDiv").carousel(0);
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
// var body = doucment
// $(doucment).ready(function(){
//     loadCities();

//     // load most recently viewed city

//     if(userCities[0] !== undefined) {
//         displayCityData(userCities[0]);
//     }

    // Create event listener for city submit button
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

    $(document).on("click", ".city-div", function(event){
        var city = $(this).text();
        displayCityData(city);
    });


