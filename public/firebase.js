// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCn0nfh2HUIUaOlJuTW0BITwkXNBup5f6k",
    authDomain: "salon-at-home-4cfc5.firebaseapp.com",
    projectId: "salon-at-home-4cfc5",
    storageBucket: "salon-at-home-4cfc5.appspot.com",
    messagingSenderId: "524162164331",
    appId: "1:524162164331:web:da9c0e24f3998962e4732e",
    measurementId: "G-W2BKWD1N96"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Firebase Auth Instance
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  