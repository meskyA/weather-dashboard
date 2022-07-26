var APIKey = "2ddb14814bcbe05573b3e39270b994a1";
var city;
userCities =[];
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

function getApi() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=2ddb14814bcbe05573b3e39270b994a1";

    fetch(requestUrl)
      .then(function (response){
          return response.json();
      })
      .then(function (data) {
          for(var i = 0; i < userCities.length; i++) {
              $("#cities").append()
              console.log(data);
          }
      })
      .catch (function() {
        //   catch any errors
      });

      }
//       window.onload = function() {

//       }
// }

// function weatherBalloon( city ) {
//     var key = '{yourkey}';
//     fetch('https://api.openweathermap.org/data/2.5/weather?id=' + city+ '&appid=' + key)  
//     .then(function(resp) { return resp.json() }) // Convert data to json
//     .then(function(data) {
//       console.log(data);
//     })
//     .catch(function() {
//       // catch any errors
//     });
//   }
  
//   window.onload = function() {
//     weatherBalloon( 6167865 );
//   }