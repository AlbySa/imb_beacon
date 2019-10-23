/*
Event Info
  - Display information related to the event the user is currently at

Author: Adam May amay787@uowmail.edu.au
last revised 23/10/2019
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';
import 'package:firebase_storage_image/firebase_storage_image.dart';


class EventInfo extends StatefulWidget {
  @override
  EventInfoState createState() => EventInfoState(activeEventName);
}

class EventInfoState extends State<EventInfo> {
  String activeEventName;
  EventInfoState(this.activeEventName);
  String photoPath = "gs://pineappleproximity.appspot.com/";


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
          //If thee is no current event an error dialog shows, otherwise function as normal
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
    //Gets the event data, including relevent images and info, and displays it to the user
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
                            padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 10),
                            child: Center(
                                child: fetchImage(),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 15),
                            child: Text(
                              '${snapshot.data['description']}',
                              style: TextStyle(
                                  fontSize: 20
                              ),
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

  //Error if no event or otherwise
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

  //Grabbing the image from Firebase
  Image fetchImage(){

    String photoPath = "gs://pineappleproximity.appspot.com/$activeEventName.png";
    print("IMAGE IS HERE: $photoPath");

      Image image = Image(image: FirebaseStorageImage(photoPath));
      return image;

  }
}


