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

//load event data
//load events selector
const eventsList = document.querySelector('#events');

//display to screen
function renderEvents(doc){
	//create elements
	let li = document.createElement('li');
	let name = document.createElement('input');
	let sTime = document.createElement('input');
	let sDate = document.createElement('input');
	let eTime = document.createElement('input');
	let eDate = document.createElement('input');
	let description = document.createElement('textarea');
	let code = document.createElement('input');
	let codeName = document.createElement('input');
	let btnShow = document.createElement('input');
	let bul = document.createElement('ul');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');
	let addtoBeacon = document.createElement('select');
	let btnadd = document.createElement('input');
	let btnremBeacon = document.createElement('input');

	//create type text box
	name.type = 'text';
	sTime.type = 'text';
	sDate.type = 'text';
	eTime.type = 'text';
	eDate.type = 'text';
	code.type = 'text';
	codeName.type = 'text';
	btnShow.type = 'button';
	btnUpdate.type = 'button';
	btnEdit.type = 'button';
	btnRemove.type = 'button';
	btnadd.type = 'button';
	btnremBeacon.type = 'button';

	//disable elements for editing
	name.disabled = true;
	sTime.disabled = true;
	sDate.disabled = true;
	eDate.disabled = true;
	eTime.disabled = true;
	code.disabled = true;
	codeName.disabled = true;
	description.disabled = true;
	btnUpdate.disabled = true;

	//populate elements
	var documentID = doc.id;
	li.setAttribute('data-id', doc.id);
	li.id= doc.id;
	name.value = doc.data().title;
	eDate.value = doc.data().endDate;
	eTime.value = doc.data().endTime;
	sTime.value = doc.data().startTime;
	sDate.value = doc.data().startDate;
	btnShow.value = "Show Events on Beacon";
	btnUpdate.value = "Update Entry";
	btnEdit.value = "Edit Entry";
	btnRemove.value = "Remove Entry";
	btnadd.value = "Add Beacon";
	btnremBeacon.value = "Remove Beacon";
	//@TODO reroute to reward sub document
	description.textContent = doc.data().description;
	btnEdit.id = "edit";

	//enable editing
	btnEdit.addEventListener("click", function(){
		var parentID = this.parentNode.id;
		var enabledElements = document.getElementById(parentID).children;

		for (var i = 0; i < enabledElements.length; i++) {
			enabledElements[i].disabled = false;
        }
	});

	//show current beacons running event
	btnShow.addEventListener("click", (e) => {
		e.stopPropagation();
	});

	//send updated document to database
	btnUpdate.addEventListener("click", (e) => {
		//update data
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		let chil = e.target.parentElement.children;
		db.collection('events').doc(id).update({
			title: chil[0].value,
			startDate: chil[1].value,
			startTime: chil[2].value,
			endDate: chil[3].value,
			endTime: chil[4].value,
			description: chil[6].value
		})
		.then((e) =>{ 
			var rewardID = "";
			db.collection('events').doc(id).collection('Rewards').get().then(snapshot => {
				snapshot.forEach(doc => {
					rewardID = doc.id;
					db.collection('events').doc(id).collection('Rewards').doc(rewardID).update({
						Name: chil[5].value
					});
				});
			});	
		});

		//disable elements for editing
		name.disabled = true;
		sTime.disabled = true;
		sDate.disabled = true;
		eDate.disabled = true;
		eTime.disabled = true;
		code.disabled = true;
		codeName.disabled = true;
		description.disabled = true;
		btnUpdate.disabled = true;
		
	});

	//remove event
	btnRemove.addEventListener("click", (e) => {
		//remove LI elements
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		var beacID = "";
		if(confirm("Are you sure you want to delete this event?")){
			//remove event from beacons
			db.collection('beacons').get().then((snapshot) => {
				snapshot.docs.forEach(doc => {
					if(id == doc.data().event){
						beacID = doc.id;
						db.collection('beacons').doc(beacID).update({
							event:""
						});
					}
				});
			});
			//delete event
			db.collection('events').doc(id).delete();
		}
	});

	//add to beacons separated by comma
	btnadd.addEventListener("click", (e) => {
		//@TODO add beacons to the display list
		//get event variable
		//get beacon variable
		//add beacon document to event
		//add event to beacon
	});

	btnremBeacon.addEventListener("click", (e) => {
		//@TODO remove beacons from the display list
		//get event variable
		//get beacon variable
		//remove beacon doc from event
		//remove event file from beacon
	});

	//add reward Subcollection
	var id = doc.id;
	db.collection('events').doc(id).collection('Rewards').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			code.value = doc.data().Name;
		});
	});

	var activeBeacons;
	//add beacons subcollection
	db.collection('beacons').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			let opt = document.createElement('option');
			opt.textContent = doc.data().name;
			addtoBeacon.appendChild(opt);
		});
	});

	//render beacons displaying this event
	var beaconList = [];
	//get beacon variable
	db.collection('events').doc(doc.id).collection('activeBeacons').get().then((snapshot) => {
		snapshot.docs.forEach(doc =>{
			beaconList.push(doc.id);
		});
	}).then(display => currentDisplayBeacons(beaconList, bul));

	//attach to list
	li.appendChild(name);
	li.appendChild(sDate);
	li.appendChild(sTime);
	li.appendChild(eDate);
	li.appendChild(eTime);
	li.appendChild(code);
	li.appendChild(description);
	li.appendChild(btnShow);
	li.appendChild(btnUpdate);
	li.appendChild(btnEdit);
	li.appendChild(btnRemove);
	li.appendChild(addtoBeacon);
	li.appendChild(btnadd);
	li.appendChild(btnremBeacon);
	li.appendChild(bul);

	eventsList.appendChild(li);
}

function currentDisplayBeacons(beaconList, bul){
	for (var i = 0; i<beaconList.length; i++){
		let bli = document.createElement('li');
		var beaconID = String(beaconList[i]);
		db.collection('beacons').doc(beaconID).get().then(doc => {
			bli.textContent = doc.data().name;
		});
		bul.appendChild(bli);
	}
}

//limits displayed events to those that meet the search
function eventSearch(){
	var searchTerm = document.getElementById('eventsearch').value;
	searchTerm = searchTerm.toUpperCase();
	var children = document.getElementById("events").childNodes;
	var child = children[0];
	//clear current data
	for(var i = 0; i < children.length; i++){
		children[i].style.display = 'block';
	}
	//display search
	var searchValue = "";
	for(var j = 0; j < children.length; j++){
		child = children[j].childNodes;
		searchValue = child[0].value;
		searchValue = searchValue.toUpperCase();
		//if match
		if ( searchValue.indexOf( searchTerm ) > -1 ) {
			console.log(searchValue + ":" + searchTerm);
		} 
		//if not match
		else{
			children[j].style.display = 'none';
		}
	}
	//if none displayed
	var count = 0;
	for(var k = 0; k < children.length; k++){
		child = children[k].childNodes;
		if(children[k].style.display == 'none'){
			count ++;
			if (count == children.length-1){
				console.log("No Results Found");
			}
		}
	}
}

//get documents
db.collection('events').orderBy('title').onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		if(change.type == 'added' ){
			renderEvents(change.doc);
		}
		else if(change.type == 'removed'){
			let li = eventsList.querySelector('[data-id = ' + change.doc.id + ']');
			eventsList.removeChild(li);
		}
	});
});

//=======================================================================================================================
//												Beacon Render
//=======================================================================================================================

//load beacon data
//load beacon selector
const beaconList = document.querySelector('#beacons');

//displays beacons on screen
function renderBeacons(doc){
	//create elements
	let li = document.createElement('li');
	li.id= doc.id;
	let bID = document.createElement('input');
	let event = document.createElement('input');
	let name = document.createElement('input');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');

	//populate elements
	li.setAttribute('data-id', doc.id);
	name.value = doc.data().name;
	bID.value = doc.id;
	event.value = doc.data().event;
	btnUpdate.type = 'button';
	btnUpdate.id = doc.id;
	btnUpdate.value = "Update Entry";
	btnEdit.type = 'button';
	btnEdit.id = doc.id;
	btnEdit.value = "Edit";
	btnRemove.type = "button";
	btnRemove.value = "Remove Entry";
	//enable edit
	btnEdit.addEventListener("click", function(){
		var parentID = this.parentNode.id;
		var enabledElements = document.getElementById(parentID).children;

		for (var i = 0; i < enabledElements.length; i++) {
			enabledElements[i].disabled = false;
        }
	});

	//sends updated event to database
	btnUpdate.addEventListener("click", (e) => {
		//@TODO add form checks
		//update data
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		let chil = e.target.parentElement.children;
		if (chil[2].value == id)
			db.collection('beacons').doc(id).update({
				name: chil[0].value,
				event: chil[2].value
			});
		else
		{
			alert("triggered");
			db.collection('beacons').doc(id).delete();
			db.collection("beacons").doc(chil[1].value).set({
				name: chil[0].value,
				event: chil[2].value
			});
		}

		//return to disabled state
		name.disabled = true;
		bID.disabled = true;
		event.disabled = true;
		btnUpdate.disabled = true;
	});

	//deletes event
	btnRemove.addEventListener("click", (e) => {
		//@TODO add are you sure
		//remove LI elements
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		if(confirm("Are you sure you want to delete this beacon?"))
			db.collection('beacons').doc(id).delete();
	});

	name.disabled = true;
	bID.disabled = true;
	event.disabled = true;
	btnUpdate.disabled = true;

	//attach to list
	li.appendChild(name);
	li.appendChild(bID);
	li.appendChild(event);
	li.appendChild(btnUpdate);
	li.appendChild(btnEdit);
	li.appendChild(btnRemove);

	beaconList.appendChild(li);
}

function beaconSearch(){
	var searchTerm = document.getElementById('beaconsearch').value;
	searchTerm = searchTerm.toUpperCase();
	var children = document.getElementById("beacons").childNodes;
	var child = children[0];
	//clear current data
	for(var l = 0; l < children.length; l++){
		children[l].style.display = 'block';
	}
	var searchValue = "";
	for(var i = 0; i < children.length; i++){
		child = children[i].childNodes;
		searchValue = child[0].value;
		searchValue = searchValue.toUpperCase();
		//if match
		if ( searchValue.indexOf( searchTerm ) > -1 ) {
			console.log(searchValue + ":" + searchTerm);
		} 
		//if not match
		else{
			children[i].style.display = 'none';
		}
	}
	//if none displayed
	var count = 0;
	for(var i = 0; i < children.length; i++){
		child = children[i].childNodes;
		if(children[i].style.display == 'none'){
			count ++;
			if (count == children.length){
				console.log("No Results Found");
			}
		}
	}
}

//get data
db.collection('beacons').orderBy('name').onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		if(change.type == 'added'){
			renderBeacons(change.doc);
		}
		else if(change.type == 'removed'){
			let li = beaconList.querySelector('[data-id = ' + change.doc.id + ']');
			beaconList.removeChild(li);
		}
	});
});