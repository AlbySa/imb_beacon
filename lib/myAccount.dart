/*
My Account Screen
  - Users Can view/edit their details
  - Summary of past events attended

Done:
  Display user data from database
  displays update icons to update info
  Update dialogue for name, email, phone

  //TODO update email in user accounts in firebase
  //TODO dialogue to change DOB
  //TODO Display past events on cards
*/

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';


class MyAccount extends StatefulWidget {
  @override
  String id;
  MyAccount(this.id);

  MyAccountState createState() => MyAccountState(id);
}

class MyAccountState extends State<MyAccount> {
  MyAccountState(this._id);


//  final bgColor = const Color(0xFFF5F5F5);
//  final barColor = const Color(0xFF02735E);

  String _id;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        title: Text("My Account"),
        backgroundColor: barColor,
      ),
      body: StreamBuilder<DocumentSnapshot>(
          stream:
              Firestore.instance.collection('users').document(_id).snapshots(),
          builder:
              (BuildContext context, AsyncSnapshot<DocumentSnapshot> snapshot) {
            if (snapshot.hasError) {
              return Text("Error: ${snapshot.error}");
            }
            switch (snapshot.connectionState) {
              case ConnectionState.waiting:
                return Text("Loading...");

              default:
                return Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      Card(
                          elevation: 8.0,
                          margin: EdgeInsets.symmetric(
                              horizontal: 10.0, vertical: 6.0),
                          child: Padding(
                              padding: const EdgeInsets.all(18.0),
                              child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: <Widget>[
                                    Row(
                                      children: <Widget>[
                                        Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: <Widget>[
                                              Text("Name: \n",
                                                  style: TextStyle(
                                                    color: barColor,
                                                    fontSize: 19,
                                                    fontWeight: FontWeight.bold,
                                                  )),
                                              Text("Email: \n",
                                                  style: TextStyle(
                                                    color: barColor,
                                                    fontSize: 19,
                                                    fontWeight: FontWeight.bold,
                                                  )),
                                              Text("Phone: \n",
                                                  style: TextStyle(
                                                    color: barColor,
                                                    fontSize: 19,
                                                    fontWeight: FontWeight.bold,
                                                  )),
                                              Text("DOB: ",
                                                  style: TextStyle(
                                                    color: barColor,
                                                    fontSize: 19,
                                                    fontWeight: FontWeight.bold,
                                                  )),
                                            ]),
                                        Padding(
                                          padding:
                                              const EdgeInsets.only(left: 12.0),
                                          child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: <Widget>[
                                                Text(
                                                    "${snapshot.data['fname']} ${snapshot.data['lname']}\n",
                                                    style: TextStyle(
                                                        fontSize: 19)),
                                                Text(
                                                    "${snapshot.data['email']}\n",
                                                    style: TextStyle(
                                                        fontSize: 19)),
                                                Text(
                                                    "${snapshot.data['phnumber']}\n",
                                                    style: TextStyle(
                                                        fontSize: 19)),
                                                Text("${snapshot.data['dob']}",
                                                    style: TextStyle(
                                                        fontSize: 19)),
                                              ]),
                                        ),
                                        Expanded(
                                          child: Container(
                                            child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.end,
                                                children: <Widget>[
                                                  IconButton(
                                                    icon: Icon(Icons.edit),
                                                    color: Colors.black38,
                                                    onPressed: () {
                                                      editName();
                                                    },
                                                  ),
                                                  IconButton(
                                                    icon: Icon(Icons.edit),
                                                    color: Colors.black38,
                                                    onPressed: () {
                                                      editEmail();
                                                      //TODO verify mail
                                                    },
                                                  ),
                                                  IconButton(
                                                    icon: Icon(Icons.edit),
                                                    color: Colors.black38,
                                                    onPressed: () {
                                                      editPhone();
                                                    },
                                                  ),
                                                  IconButton(
                                                    icon: Icon(Icons.edit),
                                                    color: Colors.black38,
                                                    onPressed: () {
                                                      //TODO Fix edit DOB
                                                      //editDOB();
                                                    },
                                                  ),
                                                ]),
                                          ),
                                        ),
                                      ],
                                    )
                                  ]))),

                      //TODO event history ???
                      Card(
                          elevation: 8.0,
                          margin: EdgeInsets.symmetric(
                              horizontal: 10.0, vertical: 6.0),
                          child: Padding(
                              padding: const EdgeInsets.all(18.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: <Widget>[
                                  Text("Past Events",
                                      style: TextStyle(
                                        color: barColor,
                                        fontSize: 19,
                                        fontWeight: FontWeight.bold,
                                      )),
                                  Padding(
                                    padding: const EdgeInsets.all(50.0),
                                    child: Container(
                                      child: Text("Events attended shown here"),
                                    ),
                                  ),
                                ],
                              ))),
                    ],
                  ),
                );
            }
          }),
    );
  }

  void editName() async {
    final _formKey = GlobalKey<FormState>();
    String _fname, _lname;

    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: Text("Edit Name"),
              content: Form(
                key: _formKey,
                child: Container(
                  child: SingleChildScrollView(
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          TextFormField(
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              enabledBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: barColor, width: 2.0),
                              ),
                              hintText: 'First Name',
                              helperText: '',
                            ),
                            validator: (input) {
                              if (input.length < 2) return 'Required Field';
                            },
                            onSaved: (input) => _fname = input,
                          ),
                          TextFormField(
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              enabledBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: barColor, width: 2.0),
                              ),
                              hintText: 'Last Name',
                              helperText: '',
                            ),
                            validator: (input) {
                              if (input.length < 2) return 'Required Field';
                            },
                            onSaved: (input) => _lname = input,
                          ),
                        ]),
                  ),
                ),
              ),
              actions: <Widget>[
                Row(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(right: 20.0),
                      child: RaisedButton(
                        child: Text(
                          "Confirm",
                          style: TextStyle(
                            color: bgColor,
                          ),
                        ),
                        color: barColor,
                        onPressed: () {
                          if (_formKey.currentState.validate()) {
                            _formKey.currentState.save();
                            try {
                              Firestore.instance
                                  .collection('users')
                                  .document(_id)
                                  .updateData(
                                      {'fname': _fname, 'lname': _lname});
                              Navigator.of(context).pop();
                            } catch (e) {}
                          }
                        },
                      ),
                    ),
                    RaisedButton(
                      child: Text(
                        "Close",
                        style: TextStyle(
                          color: bgColor,
                        ),
                      ),
                      color: Colors.deepOrange,
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                )
              ]);
        });
  }

  void editEmail() async {
    final _formKey = GlobalKey<FormState>();
    String _email;

    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: Text("Edit Email"),
              content: Form(
                key: _formKey,
                child: Container(
                  child: SingleChildScrollView(
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          TextFormField(
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              enabledBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: barColor, width: 2.0),
                              ),
                              hintText: 'Email',
                              helperText: '',
                            ),
                            validator: (input) {
                              if (!input.contains("@") || input.length < 6)
                                return 'Please enter a valid Email';
                            },
                            onSaved: (input) => _email = input,
                          ),
                        ]),
                  ),
                ),
              ),
              actions: <Widget>[
                Row(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(right: 20.0),
                      child: RaisedButton(
                        child: Text(
                          "Confirm",
                          style: TextStyle(
                            color: bgColor,
                          ),
                        ),
                        color: barColor,
                        onPressed: () {
                          if (_formKey.currentState.validate()) {
                            _formKey.currentState.save();
                            try {
                              Firestore.instance
                                  .collection('users')
                                  .document(_id)
                                  .updateData({'email': _email});
                              Navigator.of(context).pop();
                            } catch (e) {}
                          }
                        },
                      ),
                    ),
                    RaisedButton(
                      child: Text(
                        "Close",
                        style: TextStyle(
                          color: bgColor,
                        ),
                      ),
                      color: Colors.deepOrange,
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                )
              ]);
        });
  }

  void editPhone() async {
    final _formKey = GlobalKey<FormState>();
    String _phnumber;

    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: Text("Edit Phone Number"),
              content: Form(
                key: _formKey,
                child: Container(
                  child: SingleChildScrollView(
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          TextFormField(
                            keyboardType: TextInputType.phone,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              enabledBorder: OutlineInputBorder(
                                borderSide:
                                    BorderSide(color: barColor, width: 2.0),
                              ),
                              hintText: 'Phone Number',
                              helperText: '',
                            ),
                            validator: (input) {
                              if (input.length < 8 || input.length > 10)
                                return 'Please enter a valid phone number';
                            },
                            onSaved: (input) => _phnumber = input,
                          ),
                        ]),
                  ),
                ),
              ),
              actions: <Widget>[
                Row(
                  children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(right: 20.0),
                      child: RaisedButton(
                        child: Text(
                          "Confirm",
                          style: TextStyle(
                            color: bgColor,
                          ),
                        ),
                        color: barColor,
                        onPressed: () {
                          if (_formKey.currentState.validate()) {
                            _formKey.currentState.save();
                            try {
                              Firestore.instance
                                  .collection('users')
                                  .document(_id)
                                  .updateData({'phnumber': _phnumber});
                              Navigator.of(context).pop();
                            } catch (e) {}
                          }
                        },
                      ),
                    ),
                    RaisedButton(
                      child: Text(
                        "Close",
                        style: TextStyle(
                          color: bgColor,
                        ),
                      ),
                      color: Colors.deepOrange,
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                )
              ]);
        });
  }
}
