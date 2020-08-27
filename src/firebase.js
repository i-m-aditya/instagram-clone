import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyALFHsgY7FF3-iy3MKs512Z-b3NRw1LKAU",
    authDomain: "instagram-ditto.firebaseapp.com",
    databaseURL: "https://instagram-ditto.firebaseio.com",
    projectId: "instagram-ditto",
    storageBucket: "instagram-ditto.appspot.com",
    messagingSenderId: "397263649715",
    appId: "1:397263649715:web:3891943fc2a14ab1e569c6",
    measurementId: "G-NCK6EY0NCT"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }
