
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
    html += "<td> Phone Number: </td><td>" + userInformation.phnumber +"</td>"
    html += "</tr>";
    html +="</table>";
    userinfo.innerHTML = html;
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
    var searchString = searchUsers['useridentifier'].value;
    $.post('http://localhost:9000/searchUser', {fname: searchString}, function(data){
        console.log(data);
        userData = JSON.parse(data);
        renderUsers(userData);
    });
})



function deleteUser(){
    
    $.post('http://localhost:9000/deleteUser', {fname: 'name'}, function(data){
        renderUsers(data);
    });
}