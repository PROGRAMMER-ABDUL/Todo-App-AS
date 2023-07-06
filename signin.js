// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAyTAJgy0w6k8FuJknK-elAXwJNxiY6qD0",
    authDomain: "todo-app--as.firebaseapp.com",
    databaseURL: "https://todo-app--as-default-rtdb.firebaseio.com",
    projectId: "todo-app--as",
    storageBucket: "todo-app--as.appspot.com",
    messagingSenderId: "916706921168",
    appId: "1:916706921168:web:44b598fdb719d5192eacd5"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Get DOM elements
  var emailInput = document.getElementById('emailInput');
  var passwordInput = document.getElementById('passwordInput');
  var signInBtn = document.getElementById('signInBtn');
  var errorText = document.getElementById('errorText');
  
  // Event listener for "Sign In" button
  signInBtn.addEventListener('click', function() {
    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
  
    if (email === '' || password === '') {
      errorText.innerText = 'Please enter email and password';
      return;
    }
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Sign-in successful
        errorText.innerText = '';
        window.location.href = 'index.html';
      })
      .catch(function(error) {
        // Sign-in error
        errorText.innerText = error.message;
      });
  });
  