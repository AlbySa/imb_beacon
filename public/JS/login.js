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

//User login 
const loginForm = document.querySelector("#userLogin");
loginForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    var errorCode = '';
    var errorMessage = ''; 
    //Sign in with username and password credentials
    var userInfo = db.collection('users').where('email','==', email)
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            if (doc.data().isAdmin == true){
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
                    console.log(error.code + " " + error.message);
                    if (error.message){
                        document.getElementById('errorMessage').innerHTML = error.message;
                    }
                })
            }
            else {
                document.getElementById('errorMessage').innerHTML = 'User does not have administrative privileges'
            }
        })
    })

})

firebase.auth().onAuthStateChanged(function(user){
    if (user){
        window.location.assign('./home.html');
    }
})
