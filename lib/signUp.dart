/*
SignUp Screen
  - Create account
  - validate user input
  - return to login
  - email verification

  Author: Adam May amay787@uowmail.edu.au
  last revised 23/10/2019
*/

// ----------------------- Sign-up Page -----------------------
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:imb_beacon/main.dart';
import 'dart:async';


class SignUpForm extends StatefulWidget {
  @override
  SignUpFormState createState() {
    return SignUpFormState();
  }
}

class SignUpFormState extends State<SignUpForm> {
  //Variables to store a new users details
  final _formKey = GlobalKey<FormState>();
  String _email, _password, _fname, _lname, _phnumber;
  String _day, _month, _year;
  String _date = "YYYY-MM-DD";
  String _emailConfirmationTip = 'Already have an account?';
  String _dateErrorMessage = '';
  String _printEmail = '';

  var borderColor = barColor;
  var dateBorderColor = barColor;
  var dateHelpText = Colors.black54;

  double dateBorderSize = 2;

  //Building the page content (such as input fields, etc)
  @override
  Widget build(BuildContext context) {
    _year = _date.substring(0, 4);
    _month = _date.substring(5, 7);
    _day = _date.substring(8, 10);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        centerTitle: true,
        title: Text('Sign-Up'),
        backgroundColor: barColor,
      ),
      body: Form(
        key: _formKey,
        child: Container(
          padding: const EdgeInsets.only(top: 25.0, left: 40.0, right: 40.0),

          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.only(),
                  child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: borderColor, width: 2.0),
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
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: TextFormField(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: borderColor, width: 2.0),
                      ),
                      hintText: 'Password',
                      helperText: '',
                    ),
                    validator: (input) {
                      if (input.length < 6)
                        return 'Pasword must be at least 6 characters in length';
                    },
                    onSaved: (input) => _password = input,
                    obscureText: true,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: Row(children: <Widget>[
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.only(right: 5.0),
                        child: TextFormField(
                          decoration: InputDecoration(
                            border: OutlineInputBorder(),
                            enabledBorder: OutlineInputBorder(
                              borderSide:
                                  BorderSide(color: borderColor, width: 2.0),
                            ),
                            hintText: 'First Name',
                            helperText: '',
                          ),
                          validator: (input) {
                            if (input.length < 2) return 'Required Field';
                          },
                          onSaved: (input) => _fname = input,
                        ),
                      ),
                    ),
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.only(left: 5.0),
                        child: TextFormField(
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
                      ),
                    ),
                  ]),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: TextFormField(
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: borderColor, width: 2.0),
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
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: Text(
                    'Date of Birth:',
                    style: TextStyle(
                      fontSize: 17,
                      color: Colors.black54,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: Material(
                    child: Ink(
                      decoration: BoxDecoration(
                        border: Border.all(
                            color: dateBorderColor, width: dateBorderSize),
                        shape: BoxShape.rectangle,
                        color: bgColor,
                        borderRadius: BorderRadius.all(Radius.circular(5.0)),
                      ),
                      child: MaterialButton(
                          child: Text(
                            "$_day / $_month / $_year",
                            style: TextStyle(
                              fontSize: 15,
                              color: dateHelpText,
                            ),
                          ),
                          onPressed: () {
                            _selectDate(context);
                          }),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: Text(
                    _dateErrorMessage,
                    textAlign: TextAlign.left,
                    style: TextStyle(
                      color: Color(0xFFD10300),
                      fontSize: 11,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 10.0, top: 5),
                  child: RaisedButton(
                    textColor: bgColor,
                    color: barColor,
                    elevation: 5.0,
                    onPressed: () {
                      //Sign up using info

                      signUp();

                      //Hide keyboard
                      FocusScope.of(context).requestFocus(new FocusNode());
                    },
                    child: Text('Register'),
                  ),
                ),
                Text(
                  _emailConfirmationTip,
                ),
                FlatButton(
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  textColor: barColor,
                  child: Text('Log In.'),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  //Date validation
  bool dateValid() {
    if (_date == "YYYY-MM-DD") {
      //Is not valid

      setState(() {
        dateBorderColor = Color(0xFFD10300);
        _dateErrorMessage = "Please select your date of birth";
        dateBorderSize = 1;
      });

      return false;
    } else {
      setState(() {
        dateBorderColor = barColor;
        _dateErrorMessage = "";
        dateBorderSize = 2;
      });
      return true;
    }
  }

  //Send the sign up data to the database to be put into the system
  void signUp() async {
    bool test = dateValid();

    print(test);

    if (_formKey.currentState.validate() && dateValid()) {
      _formKey.currentState.save();
      try {
        setState(() {
          _printEmail = '\'$_email\'';
          _emailConfirmationTip =
              'A confirmation Email has been sent to\n$_printEmail';
        });
        AuthResult user = await FirebaseAuth.instance
            .createUserWithEmailAndPassword(email: _email, password: _password);
        _pushData(user.user.uid);

      } catch (e) {}
    }
  }

  //Date picker
  Future<void> _selectDate(BuildContext context) async {
    int currentYear = int.parse((DateTime.now().toString()).substring(0, 4));
    int currentMonth = int.parse((DateTime.now().toString()).substring(5, 7));
    int currentDay = int.parse((DateTime.now().toString()).substring(8, 10));

    DateTime picked = await showDatePicker(
      context: context,
      firstDate: DateTime(currentYear - 100, currentMonth, currentDay),
      initialDate: DateTime(currentYear - 16, currentMonth, currentDay),
      lastDate: DateTime.now(),
    );

    setState(() {
      _date = picked.toString().substring(0, 10);
      if (_date == null) {
        _date = DateTime.now().toString().substring(0, 10);
      }

      dateHelpText = Colors.black;

      _year = _date.substring(0, 4);
      _month = _date.substring(5, 7);
      _day = _date.substring(8, 10);
    });
  }

  //Final push to the database
  void _pushData(String id) {

    Firestore.instance.collection('users').document(id).setData({
      "email": _email,
      "fname": _fname,
      "lname": _lname,
      "phnumber": _phnumber,
      "dob": _date,
    });
  }
}
