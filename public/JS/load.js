//Written By Luke Sturgiss, Max Huber and Stephanie Hirshman
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


//------------------------------------------------------------------------------------------------------------------------

//load event data
//load events selector
const eventsList = document.querySelector('#events');

//display to screen
function renderEvents(doc){ //loop thingo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  let btnremBeacon = document.createElement('input');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');
	let addtoBeacon = document.createElement('select');
	let btnadd = document.createElement('input');
	let TimesVisited = document.createElement('p');

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
	TimesVisited.textContent = getVisits(name.value);

  //styling
  name.className += "form-control";
  sTime.className += "form-control";
  sDate.className += "form-control";
  eTime.className += "form-control";
  eDate.className += "form-control";
  description.className += "form-control";
  code.className += "form-control";
  codeName.className += "form-control";
  btnUpdate.className += "btn btn-sm";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';
  btnEdit.className += "btn btn-sm";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';
  btnRemove.className += "btn btn-sm";
  btnRemove.style.backgroundColor = "#007f6a";
  btnRemove.style.color = 'white';
  addtoBeacon.className += 'form-control'
  btnadd.className += "btn btn-sm";
  btnadd.style.backgroundColor = "#007f6a";
  btnadd.style.color = 'white';
  btnremBeacon.className += "btn btn-sm";
  btnremBeacon.style.backgroundColor = "#007f6a";
  btnremBeacon.style.color = 'white';



	//enable editing
	btnEdit.addEventListener("click", function(){
		var parentID = this.parentNode.id;
		var enabledElements = document.getElementById(parentID).children;

		for (var i = 0; i < enabledElements.length; i++) {
			enabledElements[i].disabled = false;
        }
	});

	//send updated document to database
	btnUpdate.addEventListener("click", (e) => {
		//update data
		e.stopPropagation();
		var parent = e.target.parentNode.id;
		var disabledElements = document.getElementById(parent).children;

		for (var i = 0; i < disabledElements.length-3; i++) {
			disabledElements[i].disabled = true;
        }

		let id = e.target.parentElement.getAttribute('data-id');
		console.log(id);
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
			db.collection('events').doc(id).collection('rewards').get().then(snapshot => {
				snapshot.forEach(doc => {
					rewardID = doc.id;
					db.collection('events').doc(id).collection('rewards').doc(rewardID).update({
						Name: chil[5].value
					});
				});
			});
		});
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
	db.collection('events').doc(id).collection('rewards').get().then((snapshot) => {
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

  //attach to elements
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
  	li.appendChild(codeTitleLabel);
  	li.appendChild(codeName);
	li.appendChild(codeLabel);
	li.appendChild(code);
	li.appendChild(descriptionLabel);
	li.appendChild(description);
	li.appendChild(document.createElement('br'));
	li.appendChild(addtoBeacon);
	li.appendChild(btnadd);
	li.appendChild(btnremBeacon);
	li.appendChild(document.createElement('br'));
	li.appendChild(document.createElement('br'));
	li.appendChild(TimesVisited);
	li.appendChild(document.createElement('br'));
	li.appendChild(document.createElement('br'));
	li.appendChild(btnUpdate);
	li.appendChild(btnEdit);
	li.appendChild(btnRemove);
	li.appendChild(document.createElement('br'));

	eventsList.appendChild(li);
}

//counts how many times the event has been visited
function getVisits(documentID)
{
	var visits = 0


	// Get reference to all of the documents
	console.log("Retrieving list of documents in collection");
	let documents = db.collection("users").get()
	  .then(snapshot => {
		snapshot.forEach(doc => {
  
		  let subCollectionDocs = db.collection("users").doc(doc.id).collection("pastEvents").get()
			.then(snapshot => {
				visits ++;
			  snapshot.forEach(doc => {
				  if(doc.id == documentIDe.replace(/ /g,"_")){
					  visits ++;
				  }
			  })
			}).catch(err => {
			  console.log("Error getting sub-collection documents", err);
			})
		});
	  }).catch(err => {
	  console.log("Error getting documents", err);
	}).then(function(){
	console.log(visits);
	if (visits > 0)
		return documentID  + " has been visited " + visits + " times";
	else
		return documentID + "has not yet been attended yet";
	});
}


//-----------------------------------------------------------
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

	//clear the dom
	var parent = document.getElementById("events");
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	}

	//create query
	db.collection('events').where('title', '==', searchTerm).get()
		.then(snapshot => {
			if (snapshot.empty) {
				console.log('No matching documents.');
				return;
			} 
			//repopulate the dom	
			snapshot.forEach(doc => {
				renderEvents(doc);
			  });
		})
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
function renderBeacons(doc){ //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  li.setAttribute("id", "beaconListSteph")
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

  //styling
  bID.className += "form-control";
  event.className += "form-control";
  name.className += "form-control";

  btnUpdate.className += "btn btn-sm";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';

  btnEdit.className += "btn btn-sm";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';

  btnRemove.className += "btn btn-sm";
  btnRemove.style.backgroundColor = "#007f6a";
  btnRemove.style.color = 'white';

	//enable edit
	btnEdit.addEventListener("click", function(){
		var parentID = this.parentNode.id;
		var enabledElements = document.getElementById(parentID).children;

		for (var i = 0; i < enabledElements.length; i++) {
			enabledElements[i].disabled = false;
        }
	});

	//sends updated event to database
	btnUpdate.addEventListener("click", (e) => { //THIS ISN"T WORKING???
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

	document.getElementById('beacons').appendChild(li);

}

function beaconSearch(){
	var searchTerm = document.getElementById('beaconsearch').value;

	//clear the dom
	var parent = document.getElementById("beacons");
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	}

	//create query
	db.collection('beacons').where('name', '==', searchTerm).get()
		.then(snapshot => {
			if (snapshot.empty) {
				console.log('No matching documents.');
				return;
			} 
			//repopulate the dom	
			snapshot.forEach(doc => {
				console.log(doc.id, '=>', doc.data());
				renderBeacons(doc);
			  });
		})
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
		window.location.assign('./index.html');
	}).catch(function(error){
		console.log(error);
	})
})
