/*
Event Info
  - Display Cards with currently available rewards
  - Claim rewards by providing a popup/screen with reward details, barcode etc

Done:
  Blank placeholder page
  //TODO Rewards page
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Rewards extends StatefulWidget {
  @override
  RewardsState createState() => RewardsState();
}

class RewardsState extends State<Rewards> {
//  final bgColor = const Color(0xFFF5F5F5);
//  final barColor = const Color(0xFF02735E);

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          title: Text("Rewards"),
          backgroundColor: barColor,
        ),
        body: Container(
          child: _rewardList()
        )
      );
  }

  _rewardList(){
    return StreamBuilder(
      stream: Firestore.instance.collection('events').document('event2').collection('Rewards').snapshots(),
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
                      title: new Text(document['name']),
                      //subtitle: new Text(document['description']),
                    ),
                    ButtonTheme.bar(
                      child: ButtonBar(
                        children: <Widget>[
                          FlatButton(
                            child: new Text('View Details'),
                            //onPressed: () => _showDialog(document),
                            onPressed: () {
                              _showDialog(document);
                            },
                          ),
                        ],
                      ),
                    )
                  ],
                )
            );
          },
        );
      }
    );
  }


  void _showDialog(DocumentSnapshot document) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
        title: Text(document['name']),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[

            SizedBox(
              height: 200.0,
              width: 200.0,
              child: QrImage(data: "test"),
            ),
            Text(""),
            Text("Placeholder Reward Information"),
          ],
        ),
        //content: Text("Description:\n" + document['description'] + "\n\nStart Date: " + document['startDate'] + "\n\nEnd Date: " + document['endDate'] + "\n\nStart Time: " + document['startTime'] + "\n\nEnd Time: " + document['endTime']),
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