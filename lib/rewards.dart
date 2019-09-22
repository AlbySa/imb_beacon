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
      stream: Firestore.instance.collection('events').document(activeEventName).collection('rewards').snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (!snapshot.hasData) return new Text("Now Loading...");
        return ListView.builder(
          itemCount: snapshot.data.documents.length,
          itemBuilder: (context, index) {
            DocumentSnapshot document = snapshot.data.documents[index];
            return Card(
              elevation: 5,
              child: new InkWell(
                onTap:() => showCoupon(document),
                child:Padding(
                  padding: const EdgeInsets.all(25.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      ListTile(
                        leading: Image.asset('assets/logo.png'),
                        title: Text("${document.data['name']}\n\nClick Me!"),

                        //subtitle: new Text(document['description']),
                      ),
                    ],
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
    var alert = new AlertDialog(
      title: Text(document.data['name']),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          SizedBox(
            height: 200.0,
            width: 200.0,
            child: Padding(
              padding: const EdgeInsets.only(bottom:20),
              child: QrImage(data: "test"),
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



}