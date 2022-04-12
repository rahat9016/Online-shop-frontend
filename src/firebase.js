import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// firebase config
const config = {
  apiKey: "AIzaSyBN00DUMko7Rg7GTl0qBrcvhLkKX_a1Hq4",
  authDomain: "ecommerce-2b718.firebaseapp.com",
  projectId: "ecommerce-2b718",
  storageBucket: "ecommerce-2b718.appspot.com",
  messagingSenderId: "512840879926",
  appId: "1:512840879926:web:407a214fe36cab0d936d97",
};
// initialize firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
// export
// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
