import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZl8lqgcxOP8WIefcTnure7o9NUPm7Ajk",
  authDomain: "knowledge-control.firebaseapp.com",
  projectId: "knowledge-control",
  storageBucket: "knowledge-control.appspot.com",
  messagingSenderId: "398100323010",
  appId: "1:398100323010:web:70aae797adcb2d4c86f95b",
  measurementId: "G-NBPQV6388J"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
export default firebase