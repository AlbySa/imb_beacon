/*
Main runner
Login Screen
Async Scanning function -> beacon connection

Author: Adam May amay787@uowmail.edu.au
last revised 23/10/2019

Android testing and implementation: Adam May amay787@uowmail.edu.au
iOS testing and implementation: Blake Coman bfc568@uowmail.edu.au


*/

import 'dart:async';
import 'dart:io' show Platform;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';
import 'package:imb_beacon/home.dart';
import 'package:imb_beacon/eventInfo.dart';
import 'package:imb_beacon/signUp.dart';
import 'package:imb_beacon/rewards.dart';
import 'package:modal_progress_hud/modal_progress_hud.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:transparent_image/transparent_image.dart';

//Base UID for eddystone -  this is used to calculate the UID we receive from the beacon
const EddystoneServiceIdAndroid = "0000feaa-0000-1000-8000-00805f9b34fb";
const EddystoneServiceIdIOS = "FEAA";

//Global variables for connected beacon/event
DocumentSnapshot activeBeacon;
String activeBeaconName = 'not connected';
DocumentSnapshot activeEvent;
String activeEventName = "";
bool signedIn = false;
bool beaconFound = false;
bool initialLoad = true;
// A variable to store the Firebase user
AuthResult user;
//DateTime
DateTime now = DateTime.now();
DateTime eventTime;


StreamController streamListController = StreamController<String>.broadcast();
Sink get nameSink => streamListController.sink;
Stream<String> get eventNameStream => streamListController.stream;

Timer timer;

//Variables for bluetooth scanning
FlutterBlue _flutterBlue = FlutterBlue.instance;
StreamSubscription _scanSubscription;
StreamSubscription _stateSubscription;

// State
BluetoothState state = BluetoothState.unknown;

//Convert beacon id to eddystone UID
String byteListToHexString(List<int> bytes) => bytes
    .map((i) => i.toRadixString(16).padLeft(2, '0'))
    .reduce((a, b) => (a + b));

//Colours
final bgColor = const Color(0xFFF5F5F5); // background colour
final barColor = const Color(0xFF02735E);// Bar/button colour

class PastEventsList{}

//Build app
void main() {
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp,DeviceOrientation.portraitDown])
      .then((_) {
    runApp(MyApp());
  });
}
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          centerTitle: true,
          title: Text('Sign-In'),
          backgroundColor: barColor,
        ),
        body: LoginForm(),
      ),
    );
  }
}

// ----------------------- Log-In Page -----------------------
class LoginForm extends StatefulWidget {
  @override
  LoginFormState createState() {
    return LoginFormState();
  }
}

class LoginFormState extends State<LoginForm> {

  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;

  // Scanning states
  Map<DeviceIdentifier, ScanResult> scanResults = new Map();
  bool adapterOn = false;
  bool isScanning = true;

  //Loading circle
  bool _saving = false;

  //Form
  final _formKey = GlobalKey<FormState>();
  String _email, _password;

  //Text field colours
  var errColor = Color(0x00F44336);
  var errBorder = barColor;
  var borderColor = Colors.black;

  //Text field controllers
  TextEditingController _controller = TextEditingController();
  TextEditingController _controller2 = TextEditingController();

  @override
  void initState() {
    super.initState();

    // FlutterBlue Setup -----------------------------------------------
    _flutterBlue.state.then((s) {
      setState(() {
        now = DateTime.now();
        state = s;
      });
      print("Initial State: $state");
      if(state == BluetoothState.on && initialLoad){//Bluetooth is on at startup
        //_periodicScan();
        _startScan();
        _checkEvent();
        initialLoad = false;
      }
    });
    _stateSubscription = _flutterBlue.onStateChanged().listen((s){ // Subscribe to state changes
      setState(() {
        state = s;

        if(state == BluetoothState.on){//Bluetooth has just been turned on
          _startScan();
          _checkEvent();
        }
        if(state == BluetoothState.off){ //Bluetooth has just been turned off
          _stopScan();
          _stopCheckEvent();
          resetConnection();
          //timer.cancel();
        }
      });
    });

    //End FlutterBlue setup

    //Local notification setup ----------------------------------------------
    flutterLocalNotificationsPlugin = new FlutterLocalNotificationsPlugin();
    var androidSettings = new AndroidInitializationSettings('app_icon');
    var iOSSettings = new IOSInitializationSettings();
    var initSettings = new InitializationSettings(androidSettings, iOSSettings);
    flutterLocalNotificationsPlugin.initialize(initSettings,onSelectNotification:selectNotification);
    //End notification setup
  }

  //Building the content of the page
  @override
  Widget build(BuildContext context) {
    // Build a Form widget using the _formKey we created above
    return Scaffold(
      body: ModalProgressHUD(
        child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              child: Column(children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(
                      left: 45, right: 45,top:20),
                  child: Container(
                    //child: Image.asset('assets/IMBLogo.png'),
                    child: FadeInImage(
                      placeholder: MemoryImage(kTransparentImage),
                      image: AssetImage("assets/IMBLogo.png"),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 40.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Padding(
                        padding: const EdgeInsets.only(top: 30.0),
                        child: TextFormField(
                          controller: _controller,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                            enabledBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: errBorder, width: 2.0),
                            ),
                            hintText: 'Email',
                          ),
                          validator: (input) {
                            if (!input.contains("@") || input.length < 6) {
                              return 'Please enter a valid Email';
                            }
                            else {return null;}
                          },
                          onSaved: (input) => _email = input,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 30.0),
                        child: TextFormField(
                          controller: _controller2,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                            enabledBorder: OutlineInputBorder(
                              borderSide:
                              BorderSide(color: errBorder, width: 2.0),
                            ),
                            hintText: 'Password',
                            helperText: 'Invalid Email or Password',
                            helperStyle: TextStyle(color: errColor),
                          ),
                          validator: (input) {
                            if (input.length < 1)
                              return 'Please enter a password';
                          },
                          onSaved: (input) => _password = input,
                          obscureText: true,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 15.0),
                        child: RaisedButton(
                          textColor: bgColor,
                          color: barColor,
                          elevation: 5.0,
                          onPressed: () {
                            // Validate will return true if the form is valid, or false if
                            // the form is invalid.
                            if (_formKey.currentState.validate()) {
                              signIn();
                            }
                          },
                          child: Text('Login'),
                        ),
                      ),
                      Text(
                        'Don\'t have an account?',
                      ),
                      FlatButton(

                        textColor: barColor,
                        child: Text('Sign up.'),
                        onPressed: () {
                          emptyText();
                          //Moves app to a different page, by calling another widget builder
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => SignUpForm()));
                      }),
                      Padding(
                        padding: const EdgeInsets.only(top:20.0),
                        child: Opacity(
                          opacity: 0.5,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              Text("Designed by "),
                              SizedBox(
                                  height:40,
                                  child: Image.asset('assets/pineappleLogo.png')
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ]),
            )),
        inAsyncCall: _saving,
      ),
    );
  }

  //Empties text fields when screen changed
  void emptyText() {
    _controller.clear();
    _controller2.clear();
  }

  //Sign in authentication
  Future<void> signIn() async {
    setState(() {
      _saving = true;
    });

    final formState = _formKey.currentState;
    formState.save();

    try {
      user = await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: _email, password: _password);

      emptyText();
      _setRewardInfo();
      signedIn=true;
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => Home(user.user.uid)));
      setState(() {
        _saving = false;
      });
    } catch (e) {
      setState(() {
        errColor = Color(0xFFF44336);
        errBorder = errColor;
        _saving = false;
      });
      print(e.message);
    }
  }

  //Copy the beacon data to the variables used by the app and flutter blue
  Future<void> connectBeacon(DocumentSnapshot beacon, DocumentSnapshot event) async {

    setState((){

      eventTime = DateTime.now();


      activeBeacon = beacon;
      activeBeaconName = beacon.data['name'];

      activeEvent = event;
      activeEventName = event.documentID;

      nameSink.add(activeEvent.data['title']);

      if(signedIn){
        _setRewardInfo();
      }
    });
  }

  //Searching for a found beacon on firebase
  Future<void> findBeacon(String beaconId) async {

    //create reference to beacon (look for beacon)
    DocumentReference beaconReference = Firestore.instance.collection("beacons").document(beaconId.toUpperCase());
    beaconReference.get().then((beaconSnapshot){

      //--------------- Check beacons ---------------
      if(beaconSnapshot.exists) { //if the beacon exists
        //create reference to event (look for event)
        DocumentReference eventReference = Firestore.instance.collection("events").document(beaconSnapshot.data['event']);
        eventReference.get().then((eventSnapshot) {

          //--------------- Check events ---------------
          if (eventSnapshot.exists) { //if the event exists



            //No active beacon
            if(activeBeacon == null){
              print("Connecting");
              connectBeacon(beaconSnapshot, eventSnapshot);
              showNotification(eventSnapshot);
              _checkEvent();
            }

            //same event
            if(activeEvent.documentID == eventSnapshot.documentID){
              eventTime = DateTime.now();
            }

            //New beacon / same event
            else if(activeBeacon.documentID != beaconSnapshot.documentID && activeEvent.documentID == eventSnapshot.documentID){
              print("Connecting");

              //connectBeacon(beaconSnapshot, eventSnapshot);

              eventTime = DateTime.now();
              activeBeacon = beaconSnapshot;
              activeBeaconName = beaconSnapshot.data['name'];
            }

            //New beacon / different event
            else if(activeBeacon.documentID != beaconSnapshot.documentID && activeEvent.documentID != eventSnapshot.documentID){
              print("Connecting");

              connectBeacon(beaconSnapshot, eventSnapshot);
              showNotification(eventSnapshot);
            }
          }
        });
      }
    });
  }

  //Show the notification
  showNotification(DocumentSnapshot event) async{
    var android = new AndroidNotificationDetails('channelId', 'channelName', 'channelDescription');
    var iOS = new IOSNotificationDetails();
    var platform = new NotificationDetails(android, iOS);
    await flutterLocalNotificationsPlugin.show(0,'Welcome to ${event.documentID}','Click here for more information',platform);
  }

  //What happens when you click the notification
  Future selectNotification(String payload){
    if(signedIn){
      showDialog(context: context,builder:(_)=> AlertDialog(
          title: Text('Welcome to ${activeEvent.data['title']}'),
          content: SizedBox(
            height: 200.0,
            width: 200.0,
            child: Text("Thank you for attending ${activeEvent.data['title']}. We are so glad you could make it!"),
          ),
          actions: <Widget>[
            Row(
              children: <Widget>[

                Padding(
                  padding: EdgeInsets.only(right:10),
                  child: RaisedButton(
                    child: Text(
                      "Rewards",
                      style: TextStyle(
                        color: bgColor,
                      ),
                    ),
                    color: barColor,
                    onPressed: () {
                      Navigator.of(context).pop();
                      Navigator.push(
                          context, MaterialPageRoute(builder: (context) => Rewards(user.user.uid)));
                    },
                  ),
                ),

                RaisedButton(
                  child: Text(
                    "Event Info",
                    style: TextStyle(
                      color: bgColor,
                    ),
                  ),
                  color: barColor,
                  onPressed: () {
                    Navigator.of(context).pop();
                    Navigator.push(
                        context, MaterialPageRoute(builder: (context) => EventInfo()));
                  },
                ),

              ],
            )
          ]
      ));
    }
    else{
      debugPrint("payload : $payload");
//      showDialog(context: context,builder:(_)=> new AlertDialog(
//        title: new Text('Notification'),
//        content: new Text('$payload'),
//      ));
    }
  }

  //-------------The following is code to implement short duration scans -----------------------
  _startScan() {


    // ignore: cancel_subscriptions
    var scanSubscription = _flutterBlue.scan(
      //timeout: const Duration(seconds: 3),
    ).listen((scanResult) {
        if (scanResult.device.type == BluetoothDeviceType.le) {
          if(scanResult.rssi>=-75){
            print("${scanResult.rssi}>= -75");
            List<int> rawBytes;
            if (Platform.isIOS) {
              rawBytes = scanResult.advertisementData.serviceData[EddystoneServiceIdIOS];
            }
            else {
              rawBytes = scanResult.advertisementData.serviceData[EddystoneServiceIdAndroid];
            }
            //Once a beacon has been found, it is then checked against the database
            if (rawBytes != null) {
              print("found:${scanResult.device.name}");
              String beaconId = byteListToHexString(rawBytes.sublist(2, 18));
              findBeacon(beaconId);
            }
          }
        }
    });

    setState(() {
      isScanning = true;
    });
  }

  _stopScan() {
    print("stopping scan...");

    _scanSubscription?.cancel();
    _scanSubscription = null;

    setState(() {
      isScanning = false;
    });
  }

//  void _periodicScan(){
//
//    //start first async scan
//    Timer(Duration(seconds: 0), () {
//      print("starting first scan");
//      _startScan();
//    });
//
//    //run another scan every minute
////    timer = Timer.periodic(Duration(minutes: 1), (timer) {
////      print("starting Periodic scan");
////      _startScan();
////    });
//  }

  void _checkEvent(){
    print("Check event started*");
    timer = Timer.periodic(Duration(seconds: 5), (timer) {

      if(activeEventName != ""){
        if(eventTime!=null&& activeEventName!=null){
          now = DateTime.now();
          print("Current time is: $now");
          print("last at event: $eventTime");
          var maxTime = eventTime.add(Duration(seconds: 10));
          if(now.isAfter(maxTime)){
            resetConnection();
          }
        }
      }
    });
  }

  void resetConnection(){
    setState(() {

      nameSink.add("");

      activeBeacon = null;
      activeBeaconName = 'not connected';
      activeEvent = null;
      activeEventName = "";
    });
    _stopCheckEvent();
  }

  void _stopCheckEvent(){
    print("Stopping event check");
    //timer.cancel();
  }

//-------------------------------------End scan code-------------------------------------------

  void _setRewardInfo() {

    Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName).get().then((querySnapshot){
      if(!(querySnapshot.exists)){
        Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName).setData({});
      }
    });

    //iterate through each reward
    Firestore.instance.collection('events').document(activeEventName).collection('rewards').getDocuments().then((querySnapshot) {
      querySnapshot.documents.forEach((doc){

        DocumentReference document = Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName);
        document.get().then((documentSnapshot){

          //if the reward hasn't already been claimed
          if(documentSnapshot.data["${doc.documentID}"] != true){
            Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName).updateData({
              "${doc.documentID}": false,
            });
          }
        });
      });
    });
  }
}