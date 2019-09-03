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
const form = document.querySelector('#eventForm');
var beaconListArray = [];
var beaconListIDArray = [];

//save event data
form.addEventListener('submit', (e) =>{
	//@TODO 	add form checks
	e.preventDefault();

	//get values
	var eventName = document.getElementById("eName").value;
	var startDate = document.getElementById("sDate").value;
	var startTime = document.getElementById("sTime").value;
	var endDate = document.getElementById("eDate").value;
	var endTime = document.getElementById("eTime").value;
	var eventCode = document.getElementById("dCode").value;
	var eventCodeName = document.getElementById("dCodeName").value;
	var eventDescription = document.getElementById("eventD").value;

	db.collection('events').add({
		title: eventName,
		startDate: startDate,
		startTime: startTime,
		endDate: endDate,
		endTime: endTime,
		description: eventDescription
	})
	.then(function(docRef){
		db.collection('events').doc(docRef.id).collection('Rewards').doc(eventCodeName).set({
			Name:eventCode
		})
		var uuid = "";
		for (var i = 0; i < beaconListIDArray.length; i++){
			uuid = beaconListIDArray[i];
			console.log(uuid);
			//set uid var
			db.collection('events').doc(docRef.id).collection('activeBeacons').doc(uuid).set({
				uid:uuid
			});
		}
	});
	db.collection('events')

	form.reset();
});
function addBeacon(){
	var selected = document.getElementById('beaconList').value;
	var selectedID = beaconList[beaconList.selectedIndex].id; 
	var existing = false;
	if (selected != "None"){
		if(beaconListArray.length != 0){
			for(var i = 0; i <= beaconListArray.length; i ++){
				if (beaconListArray[i] == selected){
					existing = true;
				}
				if (i == beaconListArray.length && existing == false){
					beaconListIDArray.push(selectedID);
					beaconListArray.push(selected);
					break;
				}
			}
		}
		else if (beaconListArray.length == 0){
			beaconListIDArray.push(selectedID);
			beaconListArray.push(selected);
		}
	}
	document.getElementById('blist').value = beaconListArray;
}

db.collection('beacons').get().then((snapshot => {
	snapshot.forEach(doc => {
		let opt = document.createElement('option');
		opt.textContent = doc.data().name;
		opt.id = doc.id;
		beaconList.appendChild(opt);
	})
}));
