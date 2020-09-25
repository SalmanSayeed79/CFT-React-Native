import firebase from 'firebase'		
import 'firebase/auth'
import 'firebase/firestore'


var firebaseConfig = {
    apiKey: "AIzaSyAoMliG7RNBeQp4BKY-qKvQcfcwoBj9GJk",
    authDomain: "codeforces-tracked.firebaseapp.com",
    databaseURL: "https://codeforces-tracked.firebaseio.com",
    projectId: "codeforces-tracked",
    storageBucket: "codeforces-tracked.appspot.com",
    messagingSenderId: "479429860260",
    appId: "1:479429860260:web:2163e02c334ae0a9433f31"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db=firebase.firestore()
  const auth=firebase.auth()


  
  export default firebase
  export {db, auth}