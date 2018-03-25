// javascript for project one
var database = firebase.database();

// Get the modal
var modal = document.getElementById('id01');

//
var userArray = [];
var userNameArray = [];
var userLocal = [];
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}



$(document).ready(function () {
	// type_holder
	// <div><label><input type="checkbox" class="types" value="mosque" />Mosque</label></div>

	var types = ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'campground', 'church', 'hindu_temple', 'lodging', 'mosque', 'movie_theater', 'museum', 'night_club', 'park', 'restaurant', 'school', 'stadium', 'synagogue'];
	var html = '';

	$.each(types, function (index, value) {
		var name = value.replace(/_/g, " ");
		html += '<div><label><input type="checkbox" class="types" value="' + value + '" />' + capitalizeFirstLetter(name) + '</label></div>';
	});

	$('#type_holder').html(html);
});

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

var map;
var infowindow;
var autocomplete;
var countryRestrict = { 'country': 'in' };
var selectedTypes = [];

function initialize() {
	autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), {
		types: ['(regions)'],
		// componentRestrictions: countryRestrict
	});

	var houston = new google.maps.LatLng(29.8159954, -95.9617495);

	map = new google.maps.Map(document.getElementById('map'), {
		center: houston,
		zoom: 10
	});
}

function renderMap() {
	// Get the user defined values
	var address = document.getElementById('address').value;
	var radius = parseInt(document.getElementById('radius').value) * 1000;

	// get the selected type
	selectedTypes = [];
	$('.types').each(function () {
		if ($(this).is(':checked')) {
			selectedTypes.push($(this).val());
		}
	});

	var geocoder = new google.maps.Geocoder();
	var selLocLat = 0;
	var selLocLng = 0;

	geocoder.geocode({ 'address': address }, function (results, status) {
		if (status === 'OK') {
			//console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

			selLocLat = results[0].geometry.location.lat();
			selLocLng = results[0].geometry.location.lng();

			//var houston = new google.maps.LatLng(29.8159954, -95.9617495);

			var houston = new google.maps.LatLng(selLocLat, selLocLng);

			map = new google.maps.Map(document.getElementById('map'), {
				center: houston,
				zoom: 10
			});

			//console.log(selectedTypes);

			var request = {
				location: houston,
				//radius: 5000,
				//types: ["atm"]
				radius: radius,
				types: selectedTypes
			};

			infowindow = new google.maps.InfoWindow();

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);
		}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i], results[i].icon);
			console.log(results[i]);
		}
	}
}

function createMarker(place, icon) {
	var placeLoc = place.geometry.location;

	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: {
			url: icon,
			scaledSize: new google.maps.Size(20, 20) // pixels
		},
		animation: google.maps.Animation.DROP
	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent('Name: ' + place.name + '<br>' + 'Address: ' + place.vicinity + '<br>' + "Rating: " + place.rating);
		infowindow.open(map, this);
	});
}










//log in information put in local storage
function localLogin() {
	// Clear sessionStorage
	sessionStorage.clear();

	// Store all content into sessionStorage
	sessionStorage.setItem("name", userLocal.name);
	sessionStorage.setItem("email", userLocal.email);
	sessionStorage.setItem("pass", userLocal.password);
}
function amILoggedIn() {
	if (sessionStorage) {
		$("#login-button").html(sessionStorage.name);
		console.log(sessionStorage.name);
	}
}
amILoggedIn();
//whenever the login button is clicked...
$("#loginBtn").on("click", function () {
	event.preventDefault();
	//declare vars from form....
	var userName = $("#loginName").val();
	var loginPassword = $("#loginPassword").val();


	//for each user in the user Array....
	for (i = 0; i < userArray.length; i++) {
		console.log(userArray[i].name);
		console.log(userName);
		//check the login name....
		switch (userName) {
			//against each user name in user array....
			case userArray[i].name:
				//and against a found-user's password
				if (loginPassword === userArray[i].password) {
					console.log("you are logged in");
					userLocal = userArray[i];
					localLogin();
					amILoggedIn();
				} else {
					console.log("PASSWORD INCORRECT")
				}
				break;
		}
	}
});
//log out
$("#logout-button").on("click", function () {
	sessionStorage.clear();
})
//whenever sign up button is clicked...
$("#signUp").on("click", function () {
	event.preventDefault();
	//define vars for input fields
	var userName = $("#inputName").val() == undefined ? '' : $("#inputName").val().trim();
	var userEmail = $("#inputEmail").val() == undefined ? '' : $("#inputEmail").val().trim();
	var password = $("#password").val() == undefined ? '' : $("#password").val().trim();
	var repeatPassword = $("#passwordRepeat").val() == undefined ? '' : $("#passwordRepeat").val().trim();
	var nameIsUnique = false;

	//if the inputs for password match...
	if (password === repeatPassword) {

		//check if username is unique
		function checkUserName(name) {
			console.log(name)
			return name == userName;
		}
		// function authFirebase() {
		// 	console.log(userNameArray.some(checkUserName));
		// }
		//if the user name matches any in firebase
		if (userNameArray.some(checkUserName)) {
			alert("username already taken")

			//or else if it doesnt match...
		} else {

			//add user to firebase
			database.ref().push({
				name: userName,
				email: userEmail,
				password: password,
				//dateAdded: firebase.database.serverValue.TIMESTAMP
			});
			userLocal = {
				"name": userName,
				"email": userEmail,
				"password": password
			}
			localLogin();
			amILoggedIn();
		}

	} else {//if the inputs for password do not match...
		alert("passwords do not match");
		//TODO:Return to signup form
	}
});

//when there is a new entry to the database...
database.ref().on("child_added", function (childSnapshot) {
	//add it to the local user array
	snap = childSnapshot.val();
	console.log(snap);
	userArray.push(snap);
	userNameArray.push(snap.name);

});


//whenever the "signup" from index is clicked...
$('#id01').on('shown.bs.modal', function () {
	$('#myInput').trigger('focus')
});

//whenever "submit search" button is clicked...

$("#submit").on("click", function (event) {

	event.preventDefault();

	var address = $("#address").val().trim();
	var longitude;
	var latitude;
	var apiArray = [
		"f0236529f3a885d0f84f69ada3bd541e"];
	var queryArray = [
		"https://api.openweathermap.org/data/2.5/weather?zip=" + (address) + "&units=imperial&APPID=" + apiArray[0]
	];
	var checkboxArray = [];


	console.log(queryArray[0]);
	$.ajax({
		url: queryArray[0],
		method: "GET"
	}).then(function (response) {

		//pass latitude and longitude values....
		console.log(response);
		longitude = response.coord.lon;
		latitude = response.coord.lat;
		console.log(latitude, longitude);


		// display weather data.....
		$("#weather-data").html("<div id='cTemp'>" + "Current Temperature: " + response.main.temp + " F </div>");
		$("#weather-data").append("<div id='cCond'>" + "Current Conditions: " + response.weather["0"].main + "</div>");
		$("#weather-data").append("<div id='humid'>" + "Humidity: " + response.main.humidity + "</div>");

	});



});
