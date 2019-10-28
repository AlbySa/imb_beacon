/*
Upcoming Events
  - display cards with upcoming IMB events
  - Selecting card to display additional info.

Author: Blake Coman bfc568@uowmail.edu.au
last revised 23/10/2019

*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';


class UpcomingEvent extends StatefulWidget {
  @override
  UpcomingEventState createState() => UpcomingEventState();
}

class UpcomingEventState extends State<UpcomingEvent> {
//  final bgColor = const Color(0xFFF5F5F5);
//  final barColor = const Color(0xFF02735E);

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          title: Text("Upcoming Events"),
          backgroundColor: barColor,
        ),
        body: Container(
          child: _eventList()
        )
      );
  }

  //Lists all events possible to attend
  _eventList() {
    return StreamBuilder(
      stream: Firestore.instance.collection('events').snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (!snapshot.hasData) return new Text("Now Loading...");
        return ListView.builder(
          itemCount: snapshot.data.documents.length,
          itemBuilder: (context, index) {
            DocumentSnapshot document = snapshot.data.documents[index];
            return Card(
              elevation: 5,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    ListTile(
                      title: new Text(document['title']),
                      subtitle: subtitle(document['description']),
                    ),
                    //If this button is pressed, the user is presented with more event details
                    ButtonTheme.bar(
                      child: ButtonBar(
                        children: <Widget>[
                          FlatButton(
                            child: new Text('View Details'),
                            onPressed: () {_showDialog(document);},
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              )
            );
          },
        );
      },
    );
  }
  //Popup with more info
  void _showDialog(DocumentSnapshot document) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
        //title: Text(document['title']),
          contentPadding: EdgeInsets.only(),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.only(bottom:20.0),
                child: InkWell(
                  child: Container(
                    decoration: BoxDecoration(color: barColor),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 20.0),
                      child: Text(document.data["title"],
                        style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold, fontSize: 20),
                        textAlign: TextAlign.center),
                    ),
                  )
                ),
            ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal:20.0),
                child: eventInfoAlert(document),
              )
          ],
        ),
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
    );
    
  }

  Text subtitle(String desc){

    if(desc.length>106){
      desc = desc.substring(0,105);
      desc = "${desc}...";
    }

    return Text(desc);

  }

  Widget eventInfoAlert(DocumentSnapshot document){

    //Text(document['description'] + "\n\nStart Date: " + document['startDate'] + "\n\nEnd Date: " + document['endDate'] + "\n\nStart Time: " + document['startTime'] + "\n\nEnd Time: " + document['endTime']);

    return Column(
      children: <Widget>[
        Text("${document['description']}\n"),
        Row(
          children: <Widget>[
            Text(
              "Start Date:   ",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              "${document['startDate']}",
            )
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(bottom:10.0),
          child: Row(
            children: <Widget>[
              Text(
                "End Date:     ",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                "${document['endDate']}",
              )
            ],
          ),
        ),
        Row(
          children: <Widget>[
            Text(
              "Start Time:   ",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              document['startTime'],
            )
          ],
        ),
        Row(
          children: <Widget>[
            Text(
              "End Time:    ",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Text(
              document['endTime'],
            )
          ],
        ),


    ],
    );

  }

}