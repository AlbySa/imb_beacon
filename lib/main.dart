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

//Base UID for eddystone -  this is used to calculate the UID we receive from the beacon
const EddystoneServiceId = "0000feaa-0000-1000-8000-00805f9b34fb";

var  activeBeacon = null;
String activeBeaconName = 'not connected';
DocumentSnapshot activeEvent = null;
String activeEventName = "event2";

//Convert beacon id to eddystone UID
String byteListToHexString(List<int> bytes) => bytes
    .map((i) => i.toRadixString(16).padLeft(2, '0'))
    .reduce((a, b) => (a + b));

final bgColor = const Color(0xFFF5F5F5); // background colour
final barColor = const Color(0xFF02735E);// Bar/button colour

void main() => runApp(MyApp());

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
  // Scanning
  FlutterBlue _flutterBlue = FlutterBlue.instance;
  StreamSubscription _scanSubscription;
  Map<DeviceIdentifier, ScanResult> scanResults = new Map();
  bool isScanning = false;

  // State
  StreamSubscription _stateSubscription;
  BluetoothState state = BluetoothState.unknown;

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
    // Immediately get the state of FlutterBlue
    _flutterBlue.state.then((s) {
      setState(() {
        state = s;
      });
    });
    // Subscribe to state changes
    _stateSubscription = _flutterBlue.onStateChanged().listen((s) {
      setState(() {
        state = s;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    // Build a Form widget using the _formKey we created above

    return Scaffold(
      floatingActionButton: _buildScanningButton(),
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
                            if (!input.contains("@") || input.length < 6)
                              return 'Please enter a valid Email';
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
                      Text('Connected beacon: $activeBeacon'),//Text('Connected beacon: $activeBeaconName'),
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
      AuthResult user = await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: _email, password: _password);

      emptyText();
      String event = "testbruh";
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

  Future<void> connectBeacon(String id, name) async {
    setState((){
      activeBeacon  = id;
      activeBeaconName = name;
    });
  }
  //TODO This is where Im up to - test code for searching firebase for a matching beacon
  Future<void> findBeacon(String beaconId) async {

    //start checking for beacon
    DocumentReference beaconReference = Firestore.instance.collection("beacons").document(beaconId.toUpperCase());

    beaconReference.get().then((beaconSnapshot) {
      if (beaconSnapshot.exists && activeBeacon != beaconId) {

        activeBeacon = beaconSnapshot;
        connectBeacon(beaconId,beaconSnapshot.data['name']);
        print('beacon: $activeBeaconName');

        //start searching for event
        if(beaconSnapshot.data['event']!="null"){

          DocumentReference eventReference = Firestore.instance.collection("events").document(beaconSnapshot.data['event']);

          eventReference.get().then((eventSnapshot) {
            if (eventSnapshot.exists) {
              activeEvent = eventSnapshot;
              activeEventName = eventSnapshot.documentID;
              print('event: $activeEventName');
            }
          });
        }
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
        List<int> rawBytes = scanResult.advertisementData.serviceData[EddystoneServiceId];
        if (rawBytes != null) {
          String beaconId = byteListToHexString(rawBytes.sublist(2, 18));
          findBeacon(beaconId);
        }
      }
    },
        onDone: _stopScan);

    setState(() {
      isScanning = true;
    });
  }

  _stopScan() {
    _scanSubscription?.cancel();
    _scanSubscription = null;
    setState(() {
      isScanning = false;
    });
  }

  _buildScanningButton() {
    if (state != BluetoothState.on) {
      return null;
    }
    if (isScanning) {
      return new FloatingActionButton(
        child: new Icon(Icons.stop),
        onPressed: _stopScan,
        backgroundColor: Colors.red,
      );
    } else {
      return new FloatingActionButton(
          child: new Icon(Icons.search), onPressed: _startScan);
    }
  }
  //-------------------------------------End scan test code-------------------------------------------
}
