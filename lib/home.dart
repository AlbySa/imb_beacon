/*
User home screen
  - Access to Rewards, myAccount, eventInfo, upcomingEvent, Logout
  - Logout button in appbar -> logout dialogue

Done:
  All 4 menu buttons lead to placeholder pages
  Logout button creates logout dialog alert
*/

import 'package:imb_beacon/myAccount.dart';
import 'package:imb_beacon/rewards.dart';
import 'package:imb_beacon/upcomingEvent.dart';
import 'package:imb_beacon/eventInfo.dart';
import 'package:imb_beacon/main.dart';

import 'dart:async';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

FlutterBlue _flutterBlue = FlutterBlue.instance;
StreamSubscription _scanSubscription;
StreamSubscription _stateSubscription;

class Home extends StatefulWidget {
  @override
  String id;

  Home(this.id);//, this.event);

  HomeState createState() => HomeState(id);//, event);
}

class HomeState extends State<Home> {
  HomeState(this.id);

  final buttonShadow = const Color(0xFF014034);

  String id;
  String event;
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _showDialog,
      child:Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          leading: Container(),
          elevation: 0.0,
          backgroundColor: bgColor,
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.exit_to_app),
              color: barColor,
              iconSize: 30,
              onPressed: () {
                _showDialog();
              },
            ),
          ],
        ),
        body: ListView(children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: 21.0, top: 10.0),
            child: Container(
              child: StreamBuilder<DocumentSnapshot>(
                  stream: Firestore.instance
                      .collection('users')
                      .document(id)
                      .snapshots(),
                  builder: (BuildContext context,
                      AsyncSnapshot<DocumentSnapshot> snapshot) {
                    if (snapshot.hasError) {
                      return Text("Error: ${snapshot.error}");
                    }
                    switch (snapshot.connectionState) {
                      case ConnectionState.waiting:
                        return Text("Loading...");
                      default:
                        return Text(
                          "Hi ${snapshot.data['fname']},",
                          style: TextStyle(color: barColor, fontSize: 30),
                        );
                    }
                  }),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 21.0, top: 10.0),
            child: Text(
              "Welcome to our app!\n",
              style: TextStyle(color: barColor, fontSize: 20),
            ),
          ),
          Center(
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Flexible(
                            child: Padding(
                              padding: const EdgeInsets.only(right: 10.0),
                              child: Material(
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0))),
                                elevation: 5.0,
                                color: barColor,
                                child: MaterialButton(
                                  height: 175.0,
                                  minWidth: 175.0,
                                  child: Column(
                                    children: <Widget>[
                                      Icon(
                                        Icons.local_activity,
                                        size: 90,
                                        color: buttonShadow,
                                      ),
                                      Text(
                                        "Rewards",
                                        style: TextStyle(color: bgColor),
                                      ),
                                    ],
                                  ),
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => Rewards(id)));
                                  },
                                ),
                              ),
                            ),
                          ),
                          Flexible(
                            child: Padding(
                              padding: const EdgeInsets.only(left: 10.0),
                              child: Material(
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0))),
                                elevation: 5.0,
                                color: barColor,
                                child: MaterialButton(
                                  height: 175.0,
                                  minWidth: 175.0,
                                  child: Column(
                                    children: <Widget>[
                                      Icon(
                                        Icons.search,
                                        size: 90,
                                        color: buttonShadow,
                                      ),
                                      Text(
                                        "Event Info.",
                                        style: TextStyle(color: bgColor),
                                      ),
                                    ],
                                  ),
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => EventInfo()));
                                  },
                                ),
                              ),
                            ),
                          )
                        ]),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Flexible(
                            child: Padding(
                              padding: const EdgeInsets.only(right: 10.0),
                              child: Material(
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0))),
                                elevation: 5.0,
                                color: barColor,
                                child: MaterialButton(
                                  height: 175.0,
                                  minWidth: 175.0,
                                  child: Column(
                                    children: <Widget>[
                                      Icon(
                                        Icons.event,
                                        size: 90,
                                        color: buttonShadow,
                                      ),
                                      Text(
                                        "Upcoming Events",
                                        style: TextStyle(color: bgColor),
                                      ),
                                    ],
                                  ),
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                UpcomingEvent()));
                                  },
                                ),
                              ),
                            ),
                          ),
                          Flexible(
                            child: Padding(
                              padding: const EdgeInsets.only(left: 10.0),
                              child: Material(
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(5.0))),
                                elevation: 5.0,
                                color: barColor,
                                child: MaterialButton(
                                  height: 175.0,
                                  minWidth: 175.0,
                                  child: Column(
                                    children: <Widget>[
                                      Icon(
                                        Icons.person,
                                        size: 90,
                                        color: buttonShadow,
                                      ),
                                      Text(
                                        "My Account",
                                        style: TextStyle(color: bgColor),
                                      ),
                                    ],
                                  ),
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => MyAccount(id)
                                      )
                                    );
                                  },
                                ),
                              ),
                            ),
                          ),
                        ]),
                  ),
                ]),
          )
        ])));
  }

  Future<bool> _showDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Logout"),
          content: Text("Are you sure you wish to logout?"),
          actions: <Widget>[
            Row(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(right: 20.0),
                  child: RaisedButton(
                    child: Text(
                      "Logout",
                      style: TextStyle(
                        color: bgColor,
                      ),
                    ),
                    color: barColor,
                    onPressed: () {
                      signedIn = false;
                      Navigator.of(context).pop();
                      Navigator.of(context).pop();
                    },
                  ),
                ),
                RaisedButton(
                  child: Text(
                    "Close",
                    style: TextStyle(
                      color: bgColor,
                    ),
                  ),
                  color: Colors.deepOrange,
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            )
          ]);
    });
  }
}
