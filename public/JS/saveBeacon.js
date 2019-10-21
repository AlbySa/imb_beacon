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
			if(confirm("An event of name " + beaconEvent + " cannot be found Do you wish to add this event?")){
				db.collection("beacons").doc(beaconID).set({
					name: beaconName,
					event: beaconEvent
				});
				db.collection('events').doc(beaconEvent).set({
					title: beaconEvent,
					startDate: "",
					startTime: "",
					endDate: "",
					endTime: "",
					description: ""
				})
				.then(function(docRef){
					db.collection('events').doc(beaconEvent).collection('rewards').doc().set({
						Name:""
					});
				});
			}
			else{
				db.collection("beacons").doc(beaconID).set({
					name: beaconName,
					event: ""
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

//Redirect if user is not signed in
firebase.auth().onAuthStateChanged(function(user){
	if (!user){
		window.location.assign('./login.html');
	}
})

//Logout function
/*var logoutListener = document.querySelector("#logout");
logoutListener.addEventListener('click',(e) =>{
	firebase.auth().signOut().then(function(){
		window.location.assign('/login.html');
	}).catch(function(error){
		console.log(error);
	})
})*/
