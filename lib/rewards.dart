/*
Event Info
  - Display Cards with currently available rewards
  - Claim rewards by providing a popup/screen with reward details, barcode etc

Author: Blake Coman bfc568@uowmail.edu.au
last revised 23/10/2019
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Rewards extends StatefulWidget {
  @override
  RewardsState createState() => RewardsState(id);

  String id;

  Rewards(this.id);
}

class RewardsState extends State<Rewards> {
//  final bgColor = const Color(0xFFF5F5F5);
//  final barColor = const Color(0xFF02735E);

  RewardsState(this.id);

  String id;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          title: Text("Rewards"),
          backgroundColor: barColor,
        ),
        body: Container(
          child: _eventCheck()
        )
      );
  }

  _rewardList(){
    return StreamBuilder(
      stream: Firestore.instance.collection('events').document(activeEventName).collection('rewards').snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (!snapshot.hasData) return new Text("Now Loading...");
        return ListView.builder(
          itemCount: snapshot.data.documents.length,
          itemBuilder: (context, index) {
            DocumentSnapshot document = snapshot.data.documents[index];
            return Padding(
              padding: const EdgeInsets.all(8.0),
              child: Card(
                elevation: 5,
                child: new InkWell(
                  onTap:() => showCoupon(document),
                  child:Padding(
                    padding: const EdgeInsets.symmetric(vertical:20.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        ListTile(
                          leading: Padding(
                            padding: const EdgeInsets.only(right: 10.0),
                            child: Image.asset('assets/logoSmall.png'),
                          ),
                          title: Text("${document.data['name']}"),
                          subtitle: Text("Click Me!"),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      }
    );
  }

  void showCoupon(DocumentSnapshot document){


    print("${id}::${activeEventName}::${document.data['name']}");

    var alert = new AlertDialog(
      title: Text(document.data['name']),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          SizedBox(
            height: 250.0,
            width: 250.0,
            child: Padding(
              padding: const EdgeInsets.only(bottom:20),
              child: QrImage(data:"${id}::${activeEventName}::${document.documentID}"),
            ),
          ),
          Text(
            document.data['description'],
            textAlign: TextAlign.center,
          )
        ],
      ),
      actions: <Widget>[
        new FlatButton(
          child: new Text('OK'),
          onPressed: () { Navigator.pop(context); },
        )
      ],
    );

    showDialog(context: context, builder: (context) => alert);
  }

  _eventCheck(){

    if(activeEventName == "" || activeEventName == null){
      return Padding(
        padding: const EdgeInsets.only(bottom:12.0),
        child: _showDialog(),
      );
    }

    else {
      return _rewardList();
    }
  }

  AlertDialog _showDialog() {
    return AlertDialog(
        title: Text("Could not load rewards"),
        content: Text("It appears you are not currently at an event with rewards.\nContact your local branch or check 'Upcoming Events' to find out more"),
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