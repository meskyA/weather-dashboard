var APIKey = "2ddb14814bcbe05573b3e39270b994a1";
var city;
userCities =[];
var lat;
var lon;


function loadCities() {
//city array from local storage
    var citiesStr = localStorage.getItem("cities");
    if (citiesStr !=null) {
        userCities = JSON.parse(cities);
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

function displayCityData(city) {
    $("#city-name").text(city);
    showWeather(city);
    showForecast(city);
}

function showWeather(city) {
    // adding another parameter after the query parameter
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city + "&appid=" + APIKey;

    fetch(
    
        queryURL
   
    //new fnction using this api to get the information for the weather forecast 
    ).then(function(res){
        return res.json()
    }).then(function(response) {
        console.log(response);
        
  
        // clear error text on successful call
        $("#help-text").text(""); 
        $("#current-temp").text("Temperature: " + parseInt(response.main.temp) + "F");
        $("#current-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + parseInt(response.wind.speed) + " MPH");

        var TimeStamp = (response.dt * 1000);
        var date = new Date(TimeStamp);
        var dateStr = ' (' + date.toLocaleDateString() + ')';
        $("#current-date").text(dateStr);

        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
        $("#current-icon").attr("src", iconURL);
        $("#current-icon").attr("alt", "weather icon");

        // var bgURL = getBgURL(icon);
        // $("#current-bg").attr("src", bgURL);
        $("#current-bg").attr("alt", "weather backgraound image");

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        fetch(queryURL
      ).then(function(res){
          return res.json()
      }
      ).then(function (response){

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
        }).catch((error) => {
            console.log("UV Index call failed");
        });
    });
}
function showForecast(city) {

    var currentDate = new Date();
    var ForacstDate;
    var DateFiff = 0;
    var ForacstDay = 0;

    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(
      
        queryURL
   
    ).then(function(res){
        return res.json()
    })
    .then(function(response){
      
         
            var forcastList = response.list;
            var forcastListLength = forcastList.length;
            var item;

            for(var i = 0; i < forcastListLength; i++){
                item = forcastList[i];
            // return to break the forecast loop   
            if (ForacstDay >= 6)
            return;

            ForecastDate = new Date(item.dt * 1000);
            DateFiff = Math.round((ForacstDate.getTime() - currentDate.getTime()) / (3600*1000));

            if (DateFiff >= 21) {
                currentDate = ForecastDate;

                var icon =item.weather [0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                $("#forcast-icon-" + ForacstDay).attr("src", iconURL);

                var dateStr = ForacstDate.toLocaleDateString();
                $("#forcast-date-" + ForacstDay).text(dateStr);

                $("#forcast-temp-" + ForacstDay).text('Temp: '+item.main.temp + ' °F');
                $("#forcase-wind-" + ForacstDay).text('Wind: '+item.wind.speed + ' MPH');
                $("#forcase-humidity-" + ForacstDay).text('Humidity: '+item.main.humidity + ' %');

                ForacstDay++;

            }
    }
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
loadCities();

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
