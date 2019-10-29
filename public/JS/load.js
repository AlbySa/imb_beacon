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
  let btnremBeacon = document.createElement('input');
	let btnUpdate = document.createElement('input');
	let btnEdit = document.createElement('input');
	let btnRemove = document.createElement('input');
	let addtoBeacon = document.createElement('select');
	let btnadd = document.createElement('input');
	let TimesVisited = document.createElement('p');

  sDate.classList.add("sDatePicker");
  eDate.classList.add("eDatePicker");
  sTime.classList.add("sTimePicker");
  eTime.classList.add("eTimePicker");

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

  //divs for styling - steph
  //row 1
  let dateRow1 = document.createElement('div');
  dateRow1.classList.add("form-group");
  dateRow1.classList.add("row");
  let r1c1 = document.createElement("div");
  r1c1.classList.add("col");
  let r1c2 = document.createElement("div");
  r1c2.classList.add("col");
  let r1c3 = document.createElement("div");
  r1c3.classList.add("col");
  let r1c4 = document.createElement("div");
  r1c4.classList.add("col");
  //row2
  let dateRow2 = document.createElement('div');
  dateRow2.classList.add("form-group");
  dateRow2.classList.add("row");
  let r2c1 = document.createElement("div");
  r2c1.classList.add("col");
  let r2c2 = document.createElement("div");
  r2c2.classList.add("col");
  let r2c3 = document.createElement("div");
  r2c3.classList.add("col");
  let r2c4 = document.createElement("div");
  r2c4.classList.add("col");

  //divs for cards
  let card = document.createElement('div');
  let cardBody = document.createElement('div');
  card.className = 'card';
  cardBody.className = 'card-body';

  //styling
  name.className += "form-control";
  sTime.style.width += "100%";
  eTime.style.width += "100%";
  sDate.style.width += "100%";
  eDate.style.width += "100%";
  sTime.className += "form-control";
  sDate.className += "form-control";
  eTime.className += "form-control";
  eDate.className += "form-control";
  description.className += "form-control";
  code.className += "form-control";
  codeName.className += "form-control";
  addtoBeacon.className += 'form-control'

  btnUpdate.className += "btn";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';
  btnUpdate.style.marginRight = "10px";

  btnEdit.className += "btn ";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';
  btnEdit.style.marginRight = "10px";

  btnRemove.className += "btn";
  btnRemove.style.backgroundColor = "#007f6a";
  btnRemove.style.color = 'white';

  btnadd.className += "btn btn-sm";
  btnadd.style.backgroundColor = "#007f6a";
  btnadd.style.color = 'white';
  btnadd.style.marginRight = '10px';

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

    let id = e.target.parentElement.getAttribute('data-id');
		let chil = e.target.parentElement.children;

		for (var i = 0; i < disabledElements.length-4; i++) {
			disabledElements[i].disabled = true;
        }

		db.collection('events').doc(id).update({
			title: chil[1].value,
			startDate: chil[3].children[3].children[0].value,
			startTime: chil[3].children[1].children[0].value,
			endDate: chil[4].children[3].children[0].value,
			endTime: chil[4].children[1].children[0].value,
			description: chil[12].value
		})
		.then((e) =>{
			var rewardID = "";
			db.collection('events').doc(id).collection('rewards').get().then(snapshot => {
				snapshot.forEach(doc => {
					rewardID = doc.id;
					db.collection('events').doc(id).collection('rewards').doc(rewardID).update({
						Name: chil[9].value
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

  //append - steph
  //row1 - for selecting dates
  dateRow1.appendChild(r1c1);
  dateRow1.appendChild(r1c2);
  dateRow1.appendChild(r1c3);
  dateRow1.appendChild(r1c4);
  r1c1.appendChild(stimeLabel);
  r1c2.appendChild(sTime);
  r1c3.appendChild(sdateLabel);
  r1c4.appendChild(sDate);
  //row2 - for selecting dates
  dateRow2.appendChild(r2c1);
  dateRow2.appendChild(r2c2);
  dateRow2.appendChild(r2c3);
  dateRow2.appendChild(r2c4);
  r2c1.appendChild(etimeLabel);
  r2c2.appendChild(eTime);
  r2c3.appendChild(edateLabel);
  r2c4.appendChild(eDate);

  //attach to elements
	cardBody.appendChild(nameLabel);
	cardBody.appendChild(name);
  cardBody.appendChild(document.createElement('br'));

  cardBody.appendChild(dateRow1);
  cardBody.appendChild(dateRow2);

  cardBody.appendChild(codeTitleLabel);
  cardBody.appendChild(codeName);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(codeLabel);
	cardBody.appendChild(code);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(descriptionLabel);
	cardBody.appendChild(description);
	cardBody.appendChild(document.createElement('br'));

  cardBody.appendChild(addtoBeacon);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(btnadd);
	cardBody.appendChild(btnremBeacon);
  cardBody.appendChild(document.createElement('br'));
	cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(btnUpdate);
	cardBody.appendChild(btnEdit);
	cardBody.appendChild(btnRemove);
  card.appendChild(cardBody);
  li.appendChild(card);
  li.appendChild(document.createElement('br'));

	eventsList.appendChild(li);
}

//counts how many times the event has been visited
function getVisits(documentID)
{
	var visits = 0


	// Get reference to all of the documents
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

			})
		});
	  }).catch(err => {
	}).then(function(){
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
	btnEdit.value = "Edit Entry";
	btnRemove.type = "button";
	btnRemove.value = "Remove Entry";

  //divs for cards
  let card = document.createElement('div');
  let cardBody = document.createElement('div');
  card.className = 'card';
  cardBody.className = 'card-body';

  //styling
  bID.className += "form-control";
  event.className += "form-control";
  name.className += "form-control";

  btnUpdate.className += "btn";
  btnUpdate.style.backgroundColor = "#007f6a";
  btnUpdate.style.color = 'white';
  btnUpdate.style.marginRight = "10px";

  btnEdit.className += "btn";
  btnEdit.style.backgroundColor = "#007f6a";
  btnEdit.style.color = 'white';
  btnEdit.style.marginRight = "10px";

  btnRemove.className += "btn";
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


	//sends updated beacon to database
	btnUpdate.addEventListener("click", (e) => {
		//update data
		e.stopPropagation();
		var parent = e.target.parentNode.id;
		var disabledElements = document.getElementById(parent).children;
		let chil = e.target.parentElement.children;
		var id = chil[3].value;
		console.log(disabledElements);

		for (var i = 0; i < disabledElements.length-2; i++) {
			disabledElements[i].disabled = true;
        }

			/*db.collection('beacons').doc(id).update({
				name: chil[1].value,
				event: chil[5].value
			});*/
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

  //cardBody.appendChild(li);

	//attach to list
	cardBody.appendChild(nameLabel);
	cardBody.appendChild(name);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(bIDLabel);
	cardBody.appendChild(bID);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(eventLabel);
	cardBody.appendChild(event);
  cardBody.appendChild(document.createElement('br'));

	cardBody.appendChild(btnUpdate);
	cardBody.appendChild(btnEdit);
	cardBody.appendChild(btnRemove);
  card.appendChild(cardBody);
  li.appendChild(card);
  li.appendChild(document.createElement('br'));

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

/*$(document).onload( function() {
  $( "#datePicker" ).datepicker();
} );*/



//$(document).ready('.sDatePicker').datepicker({ minDate: 0, dateFormat: 'dd-mm-yy' });


$(document).on("focus", ".sDatePicker", function(){
	$(this).datepicker({ minDate: 0, dateFormat: 'dd-mm-yy' });
});

$(document).on("focus", ".eDatePicker", function(){
	$(this).datepicker({ minDate: 0, dateFormat: 'dd-mm-yy' });
});

$(document).on("focus", ".sTimePicker", function(){
	$(this).timepicker({});
});

$(document).on("focus", ".eTimePicker", function(){
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
		window.location.assign('/index.html');
	}).catch(function(error){
		console.log(error);
	})
})
