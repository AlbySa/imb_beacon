//written by Luke Sturgiss
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
var eNameNo = "Unknown";

//save event data
form.addEventListener('submit', (e) =>{
	e.preventDefault();
	imagesent = false;

	//get values
	var eventName = document.getElementById("eName").value;
	var startDate = document.getElementById("sdatepicker").value;
	var startTime = document.getElementById("sTime").value;
	var endDate = document.getElementById("edatepicker").value;
	var endTime = document.getElementById("eTime").value;
	var eventCode = document.getElementById("dCode").value;
	var eventCodeName = document.getElementById("dCodeName").value;
	var eventDescription = document.getElementById("eventD").value;

	//remove space
	eNameNo = eventName.replace(/ /g,"_");


	db.collection('events').doc(eNameNo).get().then(doc => {
	if (!doc.exists){
		if (eventCode && eventCodeName != ""){
			db.collection('events').doc(eNameNo).set({
				title: eventName,
				startDate: startDate,
				startTime: startTime,
				endDate: endDate,
				endTime: endTime,
				description: eventDescription
			})
			.then(function(){
				db.collection('events').doc(eNameNo).collection('rewards').doc(eventCodeName).set({
					Name:eventCode
				});
				var uuid = "";
				for (var i = 0; i < beaconListIDArray.length; i++){
					uuid = beaconListIDArray[i];
					db.collection('beacons').doc(uuid).update({
						event: eNameNo
					});
				}
			});
		}
		else if(eventCode != ""){
			db.collection('events').doc(eNameNo).set({
				title: eventName,
				startDate: startDate,
				startTime: startTime,
				endDate: endDate,
				endTime: endTime,
				description: eventDescription
			})
			.then(function(){
				db.collection('events').doc(eNameNo).collection('rewards').doc(eventCodeName).set({
					Name:eventCode
				});
				var uuid = "";
				for (var i = 0; i < beaconListIDArray.length; i++){
					uuid = beaconListIDArray[i];
					db.collection('beacons').doc(uuid).update({
						event: eNameNo
					});
				}
			});

		}
		else if (eventCodeName != ""){
			db.collection('events').doc(eNameNo).set({
				title: eventName,
				startDate: startDate,
				startTime: startTime,
				endDate: endDate,
				endTime: endTime,
				description: eventDescription
			})
			.then(function(){
				db.collection('events').doc(eNameNo).collection('rewards').doc(eventCodeName).set({
					Name:""
				});
				var uuid = "";
				for (var i = 0; i < beaconListIDArray.length; i++){
					uuid = beaconListIDArray[i];
					db.collection('beacons').doc(uuid).update({
						event: eNameNo
					});
				}
			});
		}
	}
	else{
		//if event aready exists create override
		if(confirm("An event of name " + eventName + " Already exists Do you want to Create this Event?")){
			if (eventCode && eventCodeName != ""){
				db.collection('events').doc(eNameNo).set({
					title: eventName,
					startDate: startDate,
					startTime: startTime,
					endDate: endDate,
					endTime: endTime,
					description: eventDescription
				})
				.then(function(docRef){
					db.collection('events').doc(docRef.id).collection('rewards').doc(eventCodeName).set({
						Name:eventCode
					});
					var uuid = "";
					for (var i = 0; i < beaconListIDArray.length; i++){
						uuid = beaconListIDArray[i];
						db.collection('beacons').doc(uuid).update({
							event: docRef.id
						});
					}
				});
			}
			else if(eventCode != ""){
				db.collection('events').doc(eNameNo).set({
					title: eventName,
					startDate: startDate,
					startTime: startTime,
					endDate: endDate,
					endTime: endTime,
					description: eventDescription
				})
				.then(function(docRef){
					db.collection('events').doc(docRef.id).collection('rewards').doc().set({
						Name:eventCode
					});
					var uuid = "";
					for (var i = 0; i < beaconListIDArray.length; i++){
						uuid = beaconListIDArray[i];
						db.collection('beacons').doc(uuid).update({
							event: docRef.id
						});
					}
				});
			}
			else if (eventCodeName != ""){
				db.collection('events').doc(eNameNo).set({
					title: eventName,
					startDate: startDate,
					startTime: startTime,
					endDate: endDate,
					endTime: endTime,
					description: eventDescription
				})
				.then(function(docRef){
					db.collection('events').doc(docRef.id).collection('rewards').doc(eventCodeName).set({
						Name:""
					});
					var uuid = "";
					for (var i = 0; i < beaconListIDArray.length; i++){
						uuid = beaconListIDArray[i];
						db.collection('beacons').doc(uuid).update({
							event: docRef.id
						});
					}
				});
			}
		}
		else{
			alert("Operation Terminated");
		}
	}
});
	form.reset();
});

var imagesent = false;

function CheckFileName(){
	if(imagesent ==false)
	{
		document.getElementById("ImageUpload").disabled = false;
		eNameNo = document.getElementById("eName").value;
		eNameNo = eNameNo.replace(/ /g,"_");
	}
	else
	{
		alert("An image has already been sent under the name " + eNameNo + " Changing this will require you to reupload the image")
	}
}

function addImage(){
	imagesent = true;
	const ref = firebase.storage().ref();
	const file = document.getElementById("ImageUpload").files[0];
	eNameNo = eNameNo + ".png";
	const name = (eNameNo);
	const metadata = { name:  eNameNo};
	const task = ref.child(name).put(file, metadata);
	task
		.then(snapshot => snapshot.ref.getDownloadURL())
		.then(url => console.log(url))
}

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

//fill in select menu
db.collection('beacons').get().then((snapshot => {
	snapshot.forEach(doc => {
		let opt = document.createElement('option');
		opt.textContent = doc.data().name;
		opt.id = doc.id;
		beaconList.appendChild(opt);
	});
}));

//Redirect if user is not signed in
firebase.auth().onAuthStateChanged(function(user){
	if (!user){
		window.location.assign('./index.html');
	}
})

//Logout function
var logoutListener = document.querySelector("#logout");
logoutListener.addEventListener('click',(e) =>{
	firebase.auth().signOut().then(function(){
		window.location.assign('/index.html');
	}).catch(function(error){
		console.log(error);
	})
})




