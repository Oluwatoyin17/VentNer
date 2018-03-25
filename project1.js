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
//log in information put in local storage
function localLogin() {
	// Clear sessionStorage
	sessionStorage.clear();

	// Store all content into sessionStorage
	sessionStorage.setItem("name", userLocal.name);
	sessionStorage.setItem("email", userLocal.email);
	sessionStorage.setItem("pass", userLocal.password);
}
function amILoggedIn(){
	if (sessionStorage){
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
					localLogin();
					userLocal = userArray[i];
					amILoggedIn();
				} else {
					console.log("PASSWORD INCORRECT")
				}
				break;
		}
	}
	//TODO: log out
});
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
$("#finish-button").on("click", function (event) {
	event.preventDefault();

	//store the values for the form...
	var zipCode = $("#zipCode").val().trim();
	var longitude;
	var latitude;
	var apiArray = [
		"f0236529f3a885d0f84f69ada3bd541e",
		//"P6SP3YQDM2IL5XINGMQHQIJDYNQTZPYXJMBLMJLFTBUH4PYTMV" , 
		//"22546c4a3636b34204b7b4c7d3d682b" ,
		//"AIzaSyAOJy5-QBRK20FJ5SsYtPUkb1Urvyt_jy8"
	];
	var queryArray = [
		"https://api.openweathermap.org/data/2.5/weather?zip=" + (zipCode) + "&units=imperial&APPID=" + apiArray[0],
		//"https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=" + apiArray[1] , 
		//"https://api.meetup.com/2/events?key=" + apiArray [2] + "&group_urlname=ny-tech&sign=true" , 
		//"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&key=" + apiArray[1] , 
		//"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latitude + "," + longitude + "&radius=500&key=" + apiArray[1]
	];
	var checkboxArray = [];


	//for(i = 0; i < apiArray.length;i++){

	//var APIKey = apiArray[i];
	console.log(queryArray[0]);
	//var queryURL = queryArray[i];
	//then query Weather API for weather data (and lat/lng)
	$.ajax({
		url: queryArray[0],
		method: "GET"
	}).then(function (response) {

		//pass latitude and longitude values....
		console.log(response);
		longitude = response.coord.lon;
		latitude = response.coord.lat;
		console.log(latitude, longitude);

		//Build array of checkbox items....
		$('#checkboxDiv input:checked').each(function () {
			checkboxArray.push($(this).val());
			console.log($(this).val());
		});

		//TODO: display weather data.....
		$("#weather-data").html("<div id='cTemp'>" + "Current Temperature: " + response.main.temp + " F </div>");
		$("#weather-data").append("<div id='cCond'>" + "Current Conditions: " + response.weather["0"].main + "</div>");
		$("#weather-data").append("<div id='humid'>" + "Humidity: " + response.main.humidity + "</div>");

		//query GoogleMaps API (using LAT/LNG & checkboxArray)

		// $.ajax({
		// 	url: queryArray[1],
		// 	method: "GET"
		// }).then(function (response) {

		// 	//TODO: get results from venue checkboxes&

		// 	//TODO: display results on map and as entries

		// 	console.log(response);
		// });

	});


});
