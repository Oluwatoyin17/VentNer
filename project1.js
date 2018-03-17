

// javascript for project one

$("#finish-button").on("click", function (event){
	event.preventDefault();

	
	var zipCode= $("#zipCode").val().trim();
	
	var APIKey = "f0236529f3a885d0f84f69ada3bd541e";
	
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + (zipCode) + "&units=imperial&APPID=" + APIKey;

	
	$.ajax({
	url: queryURL,
	method: "GET"
  })

  
	.then(function(response){

		console.log(queryURL);
		console.log(response);
		$("#weather-data").html("<div id='cTemp'>" + "Current Temperature: " + response.main.temp + " F </div>");
		$("#weather-data").append("<div id='cCond'>" + "Current Conditions: " + response.weather["0"].main + "</div>");
		$("#weather-data").append("<div id='humid'>" + "Humidity: " + response.main.humidity + "</div>");

	  })

	})

