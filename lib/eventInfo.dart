/*
Event Info
  - Display information related to the event the user is currently at

Done:
  Blank placeholder page
  //TODO Event info page
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';

class EventInfo extends StatefulWidget {
  @override
  EventInfoState createState() => EventInfoState(activeEventName);
}

class EventInfoState extends State<EventInfo> {
  String activeEventName;
  EventInfoState(this.activeEventName);


  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          title: Text("Event Information"),
          backgroundColor: barColor,
        ),
        body: Container(
          child: _eventCheck()
        )
    );
  }

  _eventCheck(){

    if(activeEventName == "" || activeEventName == null){
      return Padding(
        padding: const EdgeInsets.only(bottom:12.0),
        child: _showDialog(),
      );
    }

    else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          StreamBuilder<DocumentSnapshot>(
              stream: Firestore.instance
                  .collection('events')
                  .document(activeEventName)
                  .snapshots(),
              builder: (BuildContext context,
                  AsyncSnapshot<DocumentSnapshot> snapshot) {
                if (snapshot.hasError){
                  return Container(
                    child: _showDialog(),
                  );
                }
                switch (snapshot.connectionState) {
                  case ConnectionState.waiting:
                    return Text("Loading...");
                  default:
                    return Column(
                        children: <Widget>[
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Text(
                                //"title",
                                '${snapshot.data['title']}',
                                style: TextStyle(
                                    fontSize: 30
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              //"startDate",
                              '${snapshot.data['startDate']} ${snapshot
                                  .data['startTime']}  to  ${snapshot
                                  .data['endDate']} ${snapshot
                                  .data['endTime']}',
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 60.0),
                            child: Center(
                              child: Text(
                                  ' - Event Image will go here - '
                              ),
                            ),
                          ),
                          Text(
//                'Event Description - This is where the description of the event will go...',
                            //"description",
                            '${snapshot.data['description']}',
                            style: TextStyle(
                                fontSize: 20
                            ),
                          ),
                        ]
                    );
                }
              }),
        ],
      );
    }
  }

  AlertDialog _showDialog() {
    return AlertDialog(
        title: Text("Could not load Event Info"),
        content: Text("It appears you are not currently at an event.\nContact your local branch or check 'Upcoming Events' to find out more"),
        actions: <Widget>[
          Row(
            children: <Widget>[
              RaisedButton(
                child: Text(
                  "Go Back",
                  style: TextStyle(
                    color: bgColor,
                  ),
                ),
                color: Colors.deepOrange,
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ]
          )
        ]
    );
  }
}


