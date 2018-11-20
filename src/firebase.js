import * as firebase from 'firebase/app';
import 'firebase/firestore';

let config = {
  apiKey: 'AIzaSyByNOLd5G_2ebgebwPDl61r433A7GjaaEs',
  authDomain: 'flashcard-app-ce0d2.firebaseapp.com',
  databaseURL: 'https://flashcard-app-ce0d2.firebaseio.com',
  projectId: 'flashcard-app-ce0d2',
  storageBucket: 'flashcard-app-ce0d2.appspot.com',
  messagingSenderId: '966286368199'
};

firebase.initializeApp(config);
let database = firebase.firestore();
database.settings({
  timestampsInSnapshots: true
});

export function firebaseStore() {
  return {
    database
  };
}
