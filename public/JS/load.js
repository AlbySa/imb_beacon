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
	let nameLabel = document.createElement('p');
	let name = document.createElement('input');
	let stimeLabel = document.createElement('p');
	let sTime = document.createElement('input');
	let sdateLabel = document.createElement('p');
	let sDate = document.createElement('input');
	let etimeLabel = document.createElement('p');
	let eTime = document.createElement('input');
	let edateLabel = document.createElement('p');
	let eDate = document.createElement('input');
	let descriptionLabel = document.createElement('p');
	let description = document.createElement('textarea');
	let codeLabel = document.createElement('p');
	let code = document.createElement('input');
	let codeTitleLabel = document.createElement('p');
	let codeName = document.createElement('input');
	let btnShow = document.createElement('input');
	let bul = document.createElement('ul');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');
	let addtoBeacon = document.createElement('select');
	let btnadd = document.createElement('input');
	let btnremBeacon = document.createElement('input');

	sDate.className = "datePicker";
	eDate.className = "datePicker";
	sTime.className = "timePicker";
	eTime.className = "timePicker";

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
	name.placeholder = "Event Name";
	nameLabel.textContent = "Event Title:";
	eDate.value = doc.data().endDate;
	edateLabel.textContent = "End Date:";
	eDate.placeholder = "End Date"
	eTime.value = doc.data().endTime;
	etimeLabel.textContent = "End Date:";
	eTime.placeholder = "End Date"
	sTime.value = doc.data().startTime;
	stimeLabel.textContent = "End Date:";
	sTime.placeholder = "End Date"
	sDate.value = doc.data().startDate;
	sdateLabel.textContent = "End Date:";
	sDate.placeholder = "End Date"
	btnShow.value = "Toggle Beacons Displaying Event";
	btnUpdate.value = "Update Entry";
	btnEdit.value = "Edit Entry";
	btnRemove.value = "Remove Entry";
	btnadd.value = "Add Beacon";
	btnremBeacon.value = "Remove Beacon";
	descriptionLabel.textContent = "Description:";
	description.placeholder = "Event Description";
	codeTitleLabel.textContent = "Discount Title:";
	codeLabel.textContent = "Discount Code:";
	code.placeholder = "Discount Code";
	codeName.placeholder = "Discount Name";
	description.textContent = doc.data().description;
	btnEdit.id = "edit";
	bul.id = 'bul' + doc.id;

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
		if(bul.style.display == 'block')
			bul.style.display = 'none';
		else
			bul.style.display = 'block';
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
		e.stopPropagation();
		//get event variable
		var eventID = e.target.parentElement.id;
		//get beacon variable
		var beaconID = addtoBeacon[addtoBeacon.selectedIndex].id;
		var beaconname = addtoBeacon.value;
		//add beacon document to event
		db.collection('beacons').doc(beaconID).update({
			event: eventID
		});
	});

	btnremBeacon.addEventListener("click", (e) => {
		//@TODO remove beacons from the display list
		e.stopPropagation();
		//get beacon id
		var eventID = e.target.parentElement.id;
		//get beacon variable
		var beaconID = addtoBeacon[addtoBeacon.selectedIndex].id;

		db.collection('beacons').doc(beaconID).update({
			event: ""
		});
	});

	//add reward Subcollection
	var id = doc.id;
	db.collection('events').doc(id).collection('Rewards').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			code.value = doc.data().Name;
		});
	});

	let opt = document.createElement('option');
			opt.textContent = "None";
			addtoBeacon.appendChild(opt);

	//add beacons subcollection
	db.collection('beacons').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			let opt = document.createElement('option');
			opt.textContent = doc.data().name;
			opt.id = doc.id;
			addtoBeacon.appendChild(opt);
		});
	});

	//render beacons displaying this event
	var beaconList = [];
	//get beacon variable @TODO change to search all beacons
	db.collection('beacons').get().then((snapshot) => {
		snapshot.docs.forEach(doc =>{
			//if current event
			if(doc.data().event == id){
				beaconList.push(doc.data().name);
			}
		});
	}).then(display => currentDisplayBeacons(beaconList, bul));

	//attach to list
	li.appendChild(nameLabel);
	li.appendChild(name);
	li.appendChild(sdateLabel);
	li.appendChild(sDate);
	li.appendChild(stimeLabel);
	li.appendChild(sTime);
	li.appendChild(edateLabel);
	li.appendChild(eDate);
	li.appendChild(etimeLabel);
	li.appendChild(eTime);
	li.appendChild(codeLabel);
	li.appendChild(code);
	li.appendChild(descriptionLabel);
	li.appendChild(description);
	li.appendChild(document.createElement('br'));
	li.appendChild(addtoBeacon);
	li.appendChild(btnadd);
	li.appendChild(btnremBeacon);
	li.appendChild(document.createElement('br'));
	li.appendChild(btnShow);
	li.appendChild(btnUpdate);
	li.appendChild(btnEdit);
	li.appendChild(btnRemove);
	li.appendChild(bul);

	eventsList.appendChild(li);
}

function currentDisplayBeacons(beaconList, bul){
	for (var i = 0; i<beaconList.length; i++){
		let bli = document.createElement('li');
		bli.textContent = beaconList[i];
		bul.style.display = 'none';
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
			let li = eventsList.querySelector(change.doc.id);
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
	let bIDLabel = document.createElement('p');
	let bID = document.createElement('input');
	let eventLabel = document.createElement('p')
	let event = document.createElement('input');
	let nameLabel = document.createElement('p')
	let name = document.createElement('input');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');

	//populate elements
	li.setAttribute('data-id', doc.id);
	nameLabel.textContent = 'Beacon Name:'
	name.value = doc.data().name;
	bIDLabel.textContent = 'Beacon ID:'
	bID.value = doc.id;
	eventLabel.textContent = 'Event Name:'
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
		//update data
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		let chil = e.target.parentElement.children;
		console.log(chil[1].value + " " + id)
		if (chil[1].value == id)
			db.collection('beacons').doc(id).update({
				name: chil[0].value,
				event: chil[2].value
			});
		else
		{
			db.collection('beacons').doc(id).delete();
			db.collection("beacons").doc(chil[1].value).add({
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

	btnEdit.addEventListener("click", (e) => {
		e.stopPropagation();
		let chil = e.target.parentElement.children;

		for (var i = 0; i < chil.length; i++) {
			chil[i].disabled = false;
        }
	})

	//deletes event
	btnRemove.addEventListener("click", (e) => {
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
	li.appendChild(nameLabel)
	li.appendChild(name);
	li.appendChild(bIDLabel);
	li.appendChild(bID);
	li.appendChild(eventLabel);
	li.appendChild(event);
	li.appendChild(document.createElement('br'));
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
			let li = beaconList.querySelector(change.doc.id);
			beaconList.removeChild(li);
		}
	});
});

//=======================================================================================================================
//												Date & Time Picker
//=======================================================================================================================


$(document).on("focus", ".datePicker", function(){
	$(this).datepicker({ minDate: 0, dateFormat: 'dd-mm-yy' });
});

$(document).on("focus", ".timePicker", function(){
	$(this).timepicker({});
});