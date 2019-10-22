/*
Main runner
Login Screen

Done:
  Links to sign-up
  User auth with firebase
  Cool loading circle

  Test code for bluetooth listening and Beacon UID validation
  //TODO finish playing with test code - implement/remove it
*/

import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/services.dart';
import 'package:imb_beacon/home.dart';
import 'package:imb_beacon/signUp.dart';
import 'package:modal_progress_hud/modal_progress_hud.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'dart:io' show Platform;

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

Timer timer;

FlutterBlue _flutterBlue = FlutterBlue.instance;
StreamSubscription _scanSubscription;
StreamSubscription _stateSubscription;

// State
BluetoothState state = BluetoothState.unknown;

//Convert beacon id to eddystone UID
String byteListToHexString(List<int> bytes) => bytes
    .map((i) => i.toRadixString(16).padLeft(2, '0'))
    .reduce((a, b) => (a + b));

final bgColor = const Color(0xFFF5F5F5); // background colour
final barColor = const Color(0xFF02735E);// Bar/button colour

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

  // Scanning
  Map<DeviceIdentifier, ScanResult> scanResults = new Map();
  bool adapterOn = false;
  bool isScanning = true;
  AuthResult user;


  //loading circle
  bool _saving = false;

  //form
  final _formKey = GlobalKey<FormState>();
  String _email, _password;

  //text field colours
  var errColor = Color(0x00F44336);
  var errBorder = barColor;
  var borderColor = Colors.black;

  //text field controllers
  TextEditingController _controller = TextEditingController();
  TextEditingController _controller2 = TextEditingController();

  @override
  void initState() {
    super.initState();

    // FlutterBlue Setup -----------------------------------------------
    _flutterBlue.state.then((s) {
      setState(() {
        state = s;
      });
      print("Initial State: $state");
      if(state == BluetoothState.on && initialLoad){//bluetooth has just been turned on
        _periodicScan();
        initialLoad = false;
      }
    });
    _stateSubscription = _flutterBlue.onStateChanged().listen((s){ // Subscribe to state changes
      setState(() {
        state = s;

        if(state == BluetoothState.on){//bluetooth has just been turned on
          _periodicScan();
        }
        if(state == BluetoothState.off) { //bluetooth has just been turned on
          _stopScan();
          //_stopPeriodicScan();
          resetConnection();
        }
      });
    });

    //end FlutterBlue setup

    //local notification setup ----------------------------------------------
    flutterLocalNotificationsPlugin = new FlutterLocalNotificationsPlugin();
    var androidSettings = new AndroidInitializationSettings('app_icon');
    var iOSSettings = new IOSInitializationSettings();
    var initSettings = new InitializationSettings(androidSettings, iOSSettings);
    flutterLocalNotificationsPlugin.initialize(initSettings,onSelectNotification:selectNotification);
    //end notification setup


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
    debugPrint("payload : $payload");
    showDialog(context: context,builder:(_)=> new AlertDialog(
      title: new Text('Notification'),
      content: new Text('$payload'),
    ));
  }

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
                      left: 45, right: 45, top: 37, bottom: 20),
                  child: Container(
                    child: Image.asset('assets/logo.png'),
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
                        padding: const EdgeInsets.symmetric(vertical: 15.0),
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
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => SignUpForm()));
                          }),
                      Text('(Testing)Connected beacon: $activeBeaconName'),//Text('Connected beacon: $activeBeaconName'),
                    ],
                  ),
                ),
              ]),
            )),
        inAsyncCall: _saving,
      ),
    );
  }

  //empties text fields when screen changed
  void emptyText() {
    _controller.clear();
    _controller2.clear();
  }

  //sign in authentication
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
          context, MaterialPageRoute(builder: (context) => Home(user.user.uid)));//, activeEventName)));
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

  Future<void> connectBeacon(DocumentSnapshot beacon, DocumentSnapshot event) async {

    setState((){

      activeBeacon = beacon;
      activeBeaconName = beacon.data['name'];

      activeEvent = event;
      activeEventName = event.documentID;

      if(signedIn){
        _setRewardInfo();
      }
    });
  }

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
              connectBeacon(beaconSnapshot, eventSnapshot);
              showNotification(eventSnapshot);
            }

            //New beacon / same event
            else if(activeBeacon.documentID != beaconSnapshot.documentID && activeEvent.documentID == eventSnapshot.documentID){
              connectBeacon(beaconSnapshot, eventSnapshot);
            }

            //New beacon / different event
            else if(activeBeacon.documentID != beaconSnapshot.documentID && activeEvent.documentID != eventSnapshot.documentID){
              connectBeacon(beaconSnapshot, eventSnapshot);
              showNotification(eventSnapshot);
            }

          }
        });
      }
    });
  }

  //-------------The following is test code to implement short duration scans -----------------------
  _startScan() {

    // ignore: cancel_subscriptions
    var scanSubscription = _flutterBlue.scan(
      timeout: const Duration(seconds: 3),
    ).listen((scanResult) {
      if (scanResult.device.type == BluetoothDeviceType.le) {
        List<int> rawBytes;
        if (Platform.isIOS) {
          rawBytes = scanResult.advertisementData.serviceData[EddystoneServiceIdIOS];
        }
        else {
          rawBytes = scanResult.advertisementData.serviceData[EddystoneServiceIdAndroid];
        }
        if (rawBytes != null) {
          print("found:${scanResult.device.name}");
          String beaconId = byteListToHexString(rawBytes.sublist(2, 18));
          findBeacon(beaconId);
        }
      }
    }, onDone: _stopScan);

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

  void _periodicScan(){

    //start first async scan
    Timer(Duration(seconds: 0), () {
      print("starting first scan");
      _startScan();
    });

    //run another scan every minute
    timer = Timer.periodic(Duration(minutes: 1), (timer) {
      print("starting Periodic scan");
      _startScan();
    });
  }

  void resetConnection(){
    setState(() {
      activeBeacon = null;
      activeBeaconName = 'not connected';
      activeEvent = null;
      activeEventName = "";
    });
  }

  void _stopPeriodicScan(){
    timer.cancel();
  }

//-------------------------------------End scan test code-------------------------------------------

  void _setRewardInfo() {

    //iterate through each reward
    Firestore.instance.collection('events').document(activeEventName).collection('rewards').getDocuments().then((querySnapshot) {
      querySnapshot.documents.forEach((doc){

        var attr = doc.documentID;

        DocumentReference document = Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName);
        document.get().then((documentSnapshot){

          //if the reward hasnt already been claimed

          if(documentSnapshot.data[doc.data['name']]!=true){
            //add each reward as 'false' in users/pastEvents
            Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName).setData({
              "${doc.data['name']}": false,
          });
          }
        });
      });
    });
  }
}