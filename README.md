Tutorial to set up https://www.youtube.com/watch?v=LOeioOKUKI8

Copy this into the database rules to enable
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
	//made true for testing
      allow read, write: if true;
    }
  }
}

copy this into databse to disable
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
	//made true for testing
      allow read, write: if request.auth.uid != null;
    }
  }
}
