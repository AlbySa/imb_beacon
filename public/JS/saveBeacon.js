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
	var beaconID = document.getElementById("bID").value;;
	var eventExists = false;

	console.log(beaconEvent)
	if (beaconEvent != ""){
		//check if event exists if not alert that this is the case
		db.collection("events").get().then((snapshot) => {
			snapshot.forEach(doc => {
				if(doc.id == beaconEvent)
					eventExists == true
			})
		});
		if (eventExists == false){
			if(confirm("An event of name " + beaconEvent + " cannot be found are you sure you want to create this beacon?")){
				db.collection("beacons").doc(beaconID).set({
					name: beaconName,
					event: beaconEvent
				});
			}
		}
	}
	else{
		db.collection("beacons").doc(beaconID).set({
			name: beaconName
		});
	}

	form.reset();
});