// Firebase Configuration
var firebaseConfig = {
	apiKey: "AIzaSyBWmDzF9QNXx40-IClE-NOnR7C10Dur7HQ",
	authDomain: "pineappleproximity.firebaseapp.com",
	databaseURL: "https://pineappleproximity.firebaseio.com",
	projectId: "pineappleproximity",
	storageBucket: "pineappleproximity.appspot.com",
	messagingSenderId: "499323749972",
	appId: "1:499323749972:web:319f7152d512b076"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//database connection
const db = firebase.firestore();

//save new content
//Create Event
const form = document.querySelector('#beaconForm');

//save event data
form.addEventListener('submit', (e) =>{
	//@TODO add form checks
	e.preventDefault();

	//get values
	var beaconName = document.getElementById("bName").value;
	var beaconEvent = document.getElementById("bEvent").value;
	var beaconID = "test";

	beaconID = document.getElementById("bID").value;

	console.log(beaconName)

	db.collection("beacons").doc(beaconID).set({
		name: beaconName,
		event: beaconEvent,
	});

	form.reset();
});