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


class Rewards extends StatefulWidget {
  @override
  RewardsState createState() => RewardsState();
}

class RewardsState extends State<Rewards> {

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: bgColor,
        appBar: AppBar(
          title: Text("Rewards"),
          backgroundColor: barColor,
        ),
        body: Container(



        )
    );
  }
}
