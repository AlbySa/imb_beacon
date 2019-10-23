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

loginPrompt();

var retrievedUserInformation = {};


function renderUsers(userInformation){
    var usersList = document.getElementById("useraccounts");
    var html = "<table border = 0 id= 'userstable'>";
    html += "<tr><th>First name</th><th>Last Name</th><th>Delete</th></tr>";
    for (var i = 0; i < userInformation.length; i++){
        html +="<tr class = 'names'>";
        html +="<td>" + userInformation[i].fname + "</td><td>"+ userInformation[i].lname  + '</td>';
        html +="</tr>"
    }
    html+= "</table>"
    usersList.innerHTML = html;
    tablequery();
}


function loginPrompt(){
    var modal = document.getElementById('loginModal');
    modal.style.display = "block";
}

var userData = '';

function requestUsers(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9000/requestUsers',
        dataType: 'json'
    }).done(function(data){
        userData = JSON.stringify(data);
        userData = JSON.parse(userData);
        console.log(userData);
        renderUsers(userData);
    }).fail(function(jqXHR, textStatus, err){
        console.log("AJAX Error");
    })
}

//submit new user in the system
const submitUser = document.querySelector('#submitNewUser');
submitUser.addEventListener("submit", (e) =>{
    e.preventDefault();
    var userValues = {
        firstName: submitNewUser['firstName'].value.toLowerCase(), 
        lastName: submitNewUser['lastName'].value.toLowerCase(),
        email: submitNewUser['email'].value,
        dob: submitNewUser['dob'].value,
        phonenumber: submitNewUser['phonenumber'].value
        }
    $.post('http://localhost:9000/createuser', userValues, function(data){
        document.getElementById('createUserMessage').innerHTML = data;
    })
})

//Admin Login 
const userLogin = document.querySelector("#userLogin");
userLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    var errorCode = '';
    var errorMessage = '';
    var loginCredentials = {
        email: userLogin['email'].value.toLowerCase(),
        password: userLogin['password'].value
    }
    $.post('http://localhost:9000/authenticatesysadmin', loginCredentials, function(data){
        if (data == false){
            document.getElementById("loginErrorText").innerHTML = 'This user does not have administrative privileges'
            document.getElementById("userLogin").reset();
        }
        else{
            firebase.auth().signInWithEmailAndPassword(loginCredentials.email, loginCredentials.password).catch(function (error){
                errorCode = error.code;
                errorMessage = error.message;
                document.getElementById("loginErrorText").innerHTML = error.message;
            })
            var modal = document.getElementById('loginModal');
            firebase.auth().onAuthStateChanged(function(user){
                if (user){
                    modal.style.display = "none";
                    document.getElementById("loginErrorText").innerHTML = '';
                }
            })
        }
    })
})

//Logout admin
function logoutSysAdmin() {
    firebase.auth().signOut().then(() =>{
        var modal = document.getElementById('loginModal');
        document.getElementById("userLogin").reset();
        modal.style.display = "block";
    })
}

tablerowvalue = '';

function renderUserInformation(userInformation){
    var userinfo = document.getElementById('userinformation');
    var html = "<table border = 0 id ='singleusertable'>";
    html += "<tr>";
    html += "<td> First Name: </td><td>" + userInformation.fname +"</td>"
    html += "</tr>";
    html += "<tr>"
    html += "<td> Last Name: </td><td>" + userInformation.lname +"</td>"
    html += "<tr>";
    html += "<td> Email: </td><td>" + userInformation.email +"</td>"
    html += "</tr>";
    html += "<tr>";
    html += "<td> Date of Birth: </td><td>" + userInformation.dob +"</td>"
    html += "</tr>";
    html += "<tr>";
    html += "<td> Phone Number: </td><td>" + userInformation.phonenumber +"</td>"
    html += "</tr>";
    html +="</table>";
    html +="<button id = 'deleteUserButton'> delete user </button> <button id = 'editInformation'>Edit info</button>";
    html +="</div>"
    userinfo.innerHTML = html;
    retrievedUserInformation = userInformation;
    deleteUser(userInformation);
    editUserEventListener(userInformation);

}

//create the form to edit user information 
function editUserInformationForm(userInformation){
    var userinfo = document.getElementById('userinformation');
    var html = "<form id = editUserInformation>";
    html += "<label for = 'firstname'>First name: </label>";
    html +="<input type = 'text' name ='firstname' id='firstnameedit' value = '"+ userInformation.fname + "'>";
    html +="<br /><label for ='lastname'>lastname: </label>";
    html +="<input type ='text' name='lastname' id='lastnameedit' value = '"+ userInformation.lname + "'>";
    html +="<br /><label for ='email'>lemail: </label>";
    html +="<input type ='text' name='email' id='emailedit' value = '"+ userInformation.email + "'>";
    html +="<br /><label for ='dob'>d.o.b: </label>";
    html +="<input type ='text' name='dob' id='dobedit' value = '"+ userInformation.dob + "'>";
    html +="<br /><label for ='phoneNumber'>Phone Number: </label>";
    html +="<input type ='text' name='phoneNumber' id='phoneNumberedit' value = '"+ userInformation.phonenumber + "'>";
    html +="<br /><input type ='submit' name ='updateUser' id = 'updateusersubmit'> <button id = 'cancelEdit'> cancel </button>";
    userinfo.innerHTML = html;

    submitEditedUserListener(userInformation);
}

function editUserEventListener(userInformation){
    var editUserButton = document.querySelector("#editInformation");
    editUserButton.addEventListener('click', (e) =>{
        editUserInformationForm(userInformation);
    })
}

function submitEditedUserListener(userInformation){
    var submitEditedUser = document.querySelector("#editUserInformation");
    submitEditedUser.addEventListener("submit", (e) =>{
        e.preventDefault();
        var updatedUserInformation = { newfname: submitEditedUser['firstname'].value,
        newlname: submitEditedUser['lastname'].value,
        newemail: submitEditedUser['email'].value,
        newdob: submitEditedUser['dob'].value,
        newphonenumber: submitEditedUser['phoneNumber'].value,
        oldfname: userInformation.fname,
        oldlname: userInformation.lname,
        oldemail: userInformation.email
        }
       $.post('http://localhost:9000/updateuserinformation', updatedUserInformation, function(data){
            console.log(data);
            var userinfo = document.getElementById('userinformation').innerHTML = data;
            document.getElementById('useraccounts').innerHTML = '';
        })
    })
    var cancelEditUser = document.querySelector("#cancelEdit");
    cancelEditUser.addEventListener("click", (e) =>{
        renderUserInformation(userInformation);

    })
}







//Delete user function
function deleteUser(userInformation){
    var delUserButton = document.querySelector("#deleteUserButton");
    delUserButton.addEventListener('click', (e) => {
        $.post('http://localhost:9000/deleteUser', {fname: userInformation.fname, lname: userInformation.lname, email: userInformation.email}, function(data){
            document.getElementById('accountdeleteinfo').innerHTML = data;
        })
    })
}


tablerowvalue = '';

function tablequery(){
    $(document).ready(function(){
        $(".names").click(function(){  
            tablerowvalue = $(this).children("td").get();
            $.post('http://localhost:9000/getuserinformation', {firstname: tablerowvalue[0].innerHTML, lastname: tablerowvalue[1].innerHTML}, function(data){
                console.log(data);
               var userInfo = JSON.parse(data);
            renderUserInformation(userInfo);
            });
        })
    })
}


const userSearch = document.querySelector("#searchUsers");
userSearch.addEventListener("submit", (e) =>{
    e.preventDefault();
    var emailSearch = {email: searchUsers['emailsearch'].value};
    emailSearch.email.trim();
    console.log(emailSearch);
    $.post('http://localhost:9000/searchUser', emailSearch, function(data){
        console.log(data);
        userData = JSON.parse(data);
        renderUsers(userData);
    });
})
