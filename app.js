//written by Max Huber

var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

//encoded POST parser
var urlPostParser = bodyParser.urlencoded({extended: false});

//initialise express
var app = express();

app.use(express.static(__dirname + '/public'));

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

//Server process for creating a new user
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
                        phnumber: body.phnumber
                    });
                    admin.auth().createUser({
                        email: body.email,
                        password: body.psswd
                    }).catch(function(error){
                        console.log('Error Creating User:', error)
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


//request users 
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

//Query database for search 
app.post('/searchUser', urlPostParser, function(req, res){
    var body = req.body;
    console.log(body);
    var queryResponse = [];
    var usersRef = db.collection('users').get();
        usersRef.then(snapshot =>{
            snapshot.forEach(doc =>{
                if (doc.data().email == body.email || doc.data().fname == body.fname || doc.data().lname == body.lname){
                    queryResponse.push(doc.data());
                }
        })
    }).catch(err =>{
        console.log('error creating search query');
    }).then(() =>{
        usersJSON = JSON.stringify(queryResponse);
        res.send(usersJSON);    
    })
})


//Retrieve user information for display in admin application
app.post('/getuserinformation', urlPostParser, function(req, res){
    var body = req.body;
    var response = '';
    var userRef = '';
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

//Authenticate sysAdmin 
app.post('/authenticatesysadmin', urlPostParser, function (req,res){
    console.log('post request sent to authenticate sysadmin');
    var body = req.body;
    var response = false;
    var sysAdmin = admin.auth().getUser('Vn9SJEjXwfMYp3TS9n5W0OSX3Q83').then(function(userRecord){
        userRecord.toJSON();
        if (userRecord.email != body.email){
            console.log(body.email);
            console.log('This user is not a sysadmin');
            res.send(response);
        }
        else if (userRecord.email == body.email){
            console.log('this user is a system admin');
            response = true;
            res.send(response);
        }
    }).catch(err =>{
        console.log("error occurred " + err);
    });
})

//delete users
app.post('/deleteUser', urlPostParser, function(req,res){
    var body = req.body;
    admin.auth().getUserByEmail(body.email).then(function(userRecord){
        userID = userRecord.uid;
        admin.auth().deleteUser(userID).catch(function(error) {
            console.log('Error deleting user:', error);
          });
    }).catch(err =>{
        console.log("user could not be found");
    }).then(() =>{
       var userRefDelete = db.collection('users').where('email', '==', body.email).get()
       .then(snapshot =>{
           if (snapshot.empty){
               console.log('user could not be found in database');
               return;
           }
           snapshot.forEach(doc =>{
                var userID = doc.id;
                console.log(userID);
                db.collection('users').doc(userID).delete();
                res.send('User successfully deleted');
           })
       }).catch(err =>{
           console.log(" an error has occurred retrieving user from database", err);
       }) 
    }).catch(err =>{
        console.log(err);
    })
    
})

//update user Information after it has been submitted 
app.post('/updateuserinformation', urlPostParser, function(req, res){
    var body = req.body;
    var newData = {
        fname: body.newfname,
        lname: body.newlname,
        email: body.newemail,
        dob: body.newdob,
        isAdmin: true,
        phonenumber: body.newphonenumber
    }
    var userRef = db.collection('users').where('fname','==', body.oldfname).where('lname','==', body.oldlname).get();
    userRef.then(snapshot =>{
        if(snapshot.empty){
            console.log('user could not be identified for modification');
            return;
        }
        snapshot.forEach(doc =>{
            docid = doc.id;
        })
    }).catch(err =>{
        console.log('there was an error retrieving user from database', err)
    }).then(() =>{
        db.collection('users').doc(docid).set(newData);
        admin.auth().getUserByEmail(body.oldemail).then(function(userRecord){
            admin.auth().updateUser(userRecord.uid,{
                email: body.newemail
            });
        }).catch(err =>{
            console.log('email update failed');
        })
    }).catch(err =>{
        console.log("error occurred updating database: ", err);
    }).then(() =>{
        res.send('user ' + body.oldfname + ' ' + body.oldlname + ' was successfully updated');
    })
})

app.listen(9000);
console.log('listening on port 9000');
