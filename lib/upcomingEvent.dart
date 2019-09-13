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
        body: Container());
  }
}
