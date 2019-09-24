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
  name.className += "form-control";
  document.getElementById('colName').appendChild(nameLabel);
  document.getElementById('colName2').appendChild(name);


	let stimeLabel = document.createElement('p');
	let sTime = document.createElement('input');
  sTime.className += "form-control";
  document.getElementById('myCol').appendChild(stimeLabel);
  document.getElementById('myCol2').appendChild(sTime);

	let sdateLabel = document.createElement('p');
	let sDate = document.createElement('input');
  sDate.className += "form-control";
  document.getElementById('col3').appendChild(sdateLabel);
  document.getElementById('col4').appendChild(sDate);

	let etimeLabel = document.createElement('p');
	let eTime = document.createElement('input');
  eTime.className += "form-control";
  document.getElementById('col5').appendChild(etimeLabel);
  document.getElementById('col6').appendChild(eTime);

	let edateLabel = document.createElement('p');
	let eDate = document.createElement('input');
  eDate.className += "form-control";
  document.getElementById('col7').appendChild(edateLabel);
  document.getElementById('col8').appendChild(eDate);

	let descriptionLabel = document.createElement('p');
	let description = document.createElement('textarea');
  description.className += "form-control"
  document.getElementById('col9').appendChild(descriptionLabel);
  document.getElementById('col10').appendChild(description);

	let codeLabel = document.createElement('p');
	let code = document.createElement('input');
  code.className += "form-control";
  document.getElementById('col11').appendChild(codeLabel);
  document.getElementById('col12').appendChild(code);

	let codeTitleLabel = document.createElement('p');
	let codeName = document.createElement('input');
  codeName.className += "form-control";
  document.getElementById('col13').appendChild(codeTitleLabel);
  document.getElementById('col14').appendChild(codeName);

	let btnShow = document.createElement('input');
  btnShow.className += "btn btn-sm";
  btnShow.style.backgroundColor = "#007f6a";
  btnShow.style.color = 'white';
  document.getElementById('bt1').appendChild(btnShow);


	let bul = document.createElement('ul');
	let btnUpdate = document.createElement('input');
  btnUpdate.className += "btn btn-sm";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';
  document.getElementById('bt2').appendChild(btnUpdate);


	let btnEdit = document.createElement('input');
  btnEdit.className += "btn btn-sm";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';
  document.getElementById('bt3').appendChild(btnEdit);

	let btnRemove = document.createElement('input');
  btnRemove.className += "btn btn-sm";
  btnRemove.style.backgroundColor = "#007f6a";
  btnRemove.style.color = 'white';
  document.getElementById('bt4').appendChild(btnRemove);

//br
	let addtoBeacon = document.createElement('select');
  addtoBeacon.className += 'form-control'
  document.getElementById('selThing').appendChild(addtoBeacon);


	let btnadd = document.createElement('input');
  btnadd.className += "btn btn-sm";
  btnadd.style.backgroundColor = "#007f6a";
  btnadd.style.color = 'white';
  document.getElementById('bt5').appendChild(btnadd);

	let btnremBeacon = document.createElement('input');
  btnremBeacon.className += "btn btn-sm";
  btnremBeacon.style.backgroundColor = "#007f6a";
  btnremBeacon.style.color = 'white';
  document.getElementById('bt6').appendChild(btnremBeacon);

	sDate.className += " datePicker";
	eDate.className += " datePicker";
	sTime.className += " timePicker";
	eTime.className += " timePicker";

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
	etimeLabel.textContent = "End Time:";
	eTime.placeholder = "End Date"
	sTime.value = doc.data().startTime;
	stimeLabel.textContent = "Start Time:";
	sTime.placeholder = "Start Time"
	sDate.value = doc.data().startDate;
	sdateLabel.textContent = "Start Date:";
	sDate.placeholder = "Start Date"
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


  //attach to elements
/*
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

	eventsList.appendChild(li); */

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
  document.getElementById('nameText').appendChild(bIDLabel);
	let bID = document.createElement('input');
  bID.className = "form-control";
  document.getElementById('nameInput').appendChild(bID);

	let eventLabel = document.createElement('p')
  document.getElementById('idText').appendChild(eventLabel);
	let event = document.createElement('input');
  event.className = "form-control";
  document.getElementById('idInput').appendChild(event);

	let nameLabel = document.createElement('p')
  document.getElementById('eNameL').appendChild(nameLabel);
	let name = document.createElement('input');
  name.className = "form-control";
  document.getElementById('eNameI').appendChild(name);

	let btnUpdate = document.createElement('input');
  btnUpdate.className = "btn btn-sm";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';
  document.getElementById('ebtn1').appendChild(btnUpdate);

	let btnEdit = document.createElement('input');
  btnEdit.className = "btn btn-sm";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';
  document.getElementById('ebtn2').appendChild(btnEdit);

	let btnRemove = document.createElement('input');
  btnRemove.className = "btn btn-sm";
  btnRemove.style.backgroundColor = "#007f6a";
  btnRemove.style.color = 'white';
  document.getElementById('ebtn3').appendChild(btnRemove);

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
/*	li.appendChild(nameLabel)
	li.appendChild(name);
	li.appendChild(bIDLabel);
	li.appendChild(bID);
	li.appendChild(eventLabel);
	li.appendChild(event);
	li.appendChild(document.createElement('br'));
	li.appendChild(btnUpdate);
	li.appendChild(btnEdit);
	li.appendChild(btnRemove);

	beaconList.appendChild(li); */
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
