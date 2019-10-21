var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

//encoded POST parser
var urlPostParser = bodyParser.urlencoded({extended: false});

//initialise express
var app = express();

app.use(express.static(__dirname + '/public'));
/*app.get('/', function(req, res){
    console.log(req.body);
    res.sendFile('login.html', {
        root: path.join(__dirname, './')
    });
})

app.get('/index', function(req, res){
    console.log(req.body);
    res.sendFile('index.html', {
        root: path.join(__dirname, './')
    });
})*/


//Initialise firestore admin sdk
var admin = require("firebase-admin");

var serviceAccount = require("./pineappleproximity-firebase-adminsdk-8gcrt-3bf758dd2e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pineappleproximity.firebaseio.com"
});

var db = admin.firestore();

app.get('/index', function(req, res, next){
    res.sendfile('./public/login.html');
    next();
})

app.get('/createuser', function(req,res){
    res.sendfile('./public/createUser.html');
})

app.post('/createuser', urlPostParser ,function(req, res){
    var body = req.body;
    console.log(body);
    var usersRef = db.collection('users');
    usersRef.where('fname', '==', body.firstName).where('lname', '==', body.lastName).get().then(snapshot => {
        if(snapshot.empty){
            usersRef.where('email', '==', body.email).get().then(snapshot =>{
                if(snapshot.empty){
                    usersRef.add({
                        dob: body.dob,
                        email: body.email,
                        fname: body.firstName,
                        isAdmin: true,
                        lname: body.lastName,
                        phnumber: body.phonenumber
                    });
                    admin.auth().createUser({
                        email: body.email,
                        password: 'ChangeMe'
                    }).catch(function(error){
                        console.log('Error Updating User:', error)
                        res.send(error);
                    })
                }
                else{
                    res.send('email already exists in database');
                }
            })
            
        }
        else{
            console.log('user already exists')
            res.send('user already exists');
        }
    })
    res.send('User ' + body.firstName + " " + body.lastName + " Successfully added to database");
})

app.get('/requestUsers', function(req, res, next){    
    var userCol = [];
    var usersRef = db.collection('users');
    var allUsers = usersRef.get().then(snapshot =>{
        snapshot.forEach(doc =>{
            data = doc.data();
            userCol.push(data);
            console.log(userCol.length);
        })
    }).catch(err =>{
        console.log('error occured: ', err);
    }).then(() =>{
        console.log(userCol);
        userJSON = JSON.stringify(userCol);
        res.send(userJSON);
    }).catch(err =>{
        console.log("error occurred: " + err);
    })

})

app.post('/deleteUser', urlPostParser, function (req, res){
    var body = req.body;
    var usersRef = db.collection('users').where('fname', '==', body.firstName).where('lname', '==', body.lastName).get().then(snapshot => {
        usersRef.where('email', '==', body.email).get().then(snapshot =>{
            res.send(snapshot);
        })
    })
    console.log(body);
})

app.post('/searchUser', urlPostParser, function(req, res){
    var body = req.body;
    var usersCol = [];
    var usersRef = db.collection('users').where('fname', '==', body.fname).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            usersCol.push(doc.data());
        })
        }).catch(err =>{
            console.log("error occurred: " + err);
    }).then(() =>{
        userJSON = JSON.stringify(usersCol);
        res.send(userJSON);
    }).catch(err =>{
        console.log(err);
    })

})

app.post('/getuserinformation', urlPostParser, function(req, res){
    var body = req.body;
    var response = '';
    var usersRef = db.collection('users').where('fname', '==', body.firstname).where('lname', '==', body.lastname).get()
    .then(snapshot =>{
        snapshot.forEach(doc =>{
            response = doc.data();
        })
    }).catch(err =>{
        console.log("error occured");
    }).then(()=>{
        userJSON = JSON.stringify(response);
        res.send(userJSON);
    })
})

app.listen(9000);
console.log('listening on port 9000');
