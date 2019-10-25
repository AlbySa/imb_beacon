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
          //Depending on what event is current, different objects are created
          child: _eventCheck()
        )
      );
  }

  //If an event is in place, then the rewards are listed
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
              padding: const EdgeInsets.only(right: 8.0,left:8.0,top: 2.0),
              child: createCard(document),
            );
          },
        );
      }
    );
  }

  //A popup showing the coupon provided by a reward
  void showCoupon(DocumentSnapshot document, Widget qrCode){

    print("${id}::${activeEventName}::${document.documentID}");

    var alert = new AlertDialog(
      //title: Text(document.data['name']),
      contentPadding: EdgeInsets.only(),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(bottom:20.0),
            child: InkWell(
              child: Container(
                padding: EdgeInsets.only(top: 20.0, bottom: 20.0),
                decoration: BoxDecoration(
                  color: barColor,
                ),
                child: Text(
                  "${document.data['name']}",
                  style: TextStyle(color: Colors.white,fontWeight: FontWeight.bold, fontSize: 20),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ),


          qrCode,
        ],
      ),
      actions: <Widget>[
        RaisedButton(
          child: Text("OK",style: TextStyle(color: bgColor),),
          color: barColor,
          onPressed: () {Navigator.pop(context);},
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

  //Lack of event, or other error dialog
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

  Widget createCard(DocumentSnapshot document) {

    print("create Cards");

    return StreamBuilder(
      stream: Firestore.instance.collection('users').document(user.user.uid).collection('pastEvents').document(activeEventName).snapshots(),
      builder: (BuildContext context, snapshot) {
        if (!snapshot.hasData) return new Text("Now Loading...");

        var used = snapshot.data[document.documentID];

        Color cardColour = bgColor;
        double _opacity = 1.0;
        String claimedText = "";
        Widget qrCode;

        if(used){
          cardColour = Colors.grey;
          _opacity = 0.5;
          claimedText = " - claimed";
          qrCode = Align(
            alignment: Alignment.center,
              child: Text("This reward has already been claimed\n",
                textAlign: TextAlign.center,
              )
          );
        }

        else{
          qrCode = Column(
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
              ),
            ],
          );
        }

        return Card(
            elevation: 5,
            color: cardColour,
            child: Opacity(
              opacity: _opacity,
              child: InkWell(
                onTap: () => showCoupon(document, qrCode),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      ListTile(
                        leading: Padding(
                          padding: const EdgeInsets.only(right: 10.0),
                          child: Image.asset('assets/logoSmall.png'),
                        ),
                        title: Row(
                          children: <Widget>[
                            Text(document.data['name']),
                            Text(
                              claimedText,
                              style: TextStyle(fontStyle: FontStyle.italic),
                            )
                          ],
                        ),
                        subtitle: Text("Click Me!"),
                      ),
                    ],
                  ),
                ),
              ),
            )
        );
      }
    );
  }
}
