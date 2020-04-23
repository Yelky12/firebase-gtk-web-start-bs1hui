// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startSRVP');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
const firebaseConfig = {
    apiKey: "AIzaSyDdKLs31PN_49mTdSbL13gfjTer4Rkgm_E",
    authDomain: "fir-web-codelab-33952.firebaseapp.com",
    databaseURL: "https://fir-web-codelab-33952.firebaseio.com",
    projectId: "fir-web-codelab-33952",
    storageBucket: "fir-web-codelab-33952.appspot.com",
    messagingSenderId: "680108379662",
    appId: "1:680108379662:web:6bd39a0164aaffdcc8b65f"
  };

firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
credentialHelper: firebaseui.auth.CredentialHelper.NONE,
signInOptions: [
// Email / Password Provider.
firebase.auth.EmailAuthProvider.PROVIDER_ID
],
callbacks: {
signInSuccessWithAuthResult: function(authResult, redirectUrl){
// Handle sign-in.
// Return false to avoid redirect.
return false;
}
}
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

startRsvpButton.addEventListener("click", ()=> {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    ui.start("#firebaseui-auth-container", uiConfig);
  }
});

firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    startRsvpButton.textContent = "LOGOUT";
    guestbookContainer.style.display = "block";
    subscribeGuestbook();
  } else {
    startRsvpButton.textContent = "RSVP";
    guestbookContainer.style.display="none";
    unsubscribeGuestBook();
  }
});

form.addEventListener("submit",(e)=> {
  e.preventDefault();

  firebase.firestore().collection("guestbook").add({
    text: input.value,
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid
  });

  input.nodeValue="";
  return false;
});

function subscribeGuestbook(){
guestbookListener = firebase.firestore().collection("guestbook")
.orderBy("timestamp","desc")
.onSnapshot((snaps) => {
 // Reset page
 guestbook.innerHTML = "";
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   const entry = document.createElement("p");
   entry.textContent = doc.data().name + ": " + doc.data().text;
   guestbook.appendChild(entry);
 });
});
};

function unsubscribeGuestBook(){
  if (guestbookListener != null){
    guestbookListener();
    guestbookListener=null;
  }
};