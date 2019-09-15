/*
Upcoming Events
  - display cards with upcoming IMB events
  - Selecting card to display additional info.

Done:
  Blank placeholder page

  //TODO Upcoming Events page
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
              child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            ListTile(
              title: new Text(document['title']),
              subtitle: new Text(document['description']),
            ),
            ButtonTheme.bar(
              child: ButtonBar(
                children: <Widget>[
                  FlatButton(
                    child: new Text('View Details'),
                    //onPressed: () => _showDialog(document),
                    onPressed: () {_showDialog(document);},
                  ),
                ],
              ),
            )
          ],
        )
            );
          },
        );
      },
    );
  }

  void _showDialog(DocumentSnapshot document) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
        title: Text(document['title']),
        content: Text("Description:\n" + document['description'] + "\n\nStart Date: " + document['startDate'] + "\n\nEnd Date: " + document['endDate'] + "\n\nStart Time: " + document['startTime'] + "\n\nEnd Time: " + document['endTime']),
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

}