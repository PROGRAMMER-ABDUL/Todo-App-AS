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
  
  // Get a reference to the Firebase services
  var auth = firebase.auth();
  var database = firebase.database();
  
  // Get DOM elements
  var taskInput = document.getElementById('task-input');
  var addTaskBtn = document.getElementById('add-task-btn');
  var taskList = document.getElementById('task-list');
  var deleteAllBtn = document.getElementById('delete-all-btn');
  var userSection = document.getElementById('user-section');
  var userEmail = document.getElementById('user-email');
  var signOutBtn = document.getElementById('sign-out-btn');
  
  // Declare the user variable
  var user;
  
  // Event listener for "Add Task" button
  addTaskBtn.addEventListener('click', function() {
    var task = taskInput.value.trim();
    if (task !== '') {
      // Push the new task to Firebase database
      if (user) {
        database.ref('tasks/' + user.uid).push({
          task: task
        });
        taskInput.value = '';
      }
    }
  });
  
 // Event listener for Firebase "child_added" event
firebase.auth().onAuthStateChanged(function(currentUser) {
    user = currentUser;
    if (user) {
      // User is signed in
      userSection.style.display = 'block';
      userEmail.innerText = user.email;
  
      database.ref('tasks/' + user.uid).on('child_added', function(snapshot) {
        var task = snapshot.val().task;
        var taskId = snapshot.key;
        createTaskElement(task, taskId);
      });
  
      // Event listener for delete button
      taskList.addEventListener('click', function(event) {
        var target = event.target;
        if (target.classList.contains('delete-btn')) {
          var taskId = target.getAttribute('data-task-id');
          if (taskId) {
            deleteTask(user.uid, taskId);
          }
        }
      });
    } else {
      // User is signed out
      userSection.style.display = 'none';
      userEmail.innerText = '';
  
      taskList.innerHTML = '';
      if (window.location.pathname !== '/signin.html' && window.location.pathname !== '/register.html') {
        window.location.href = 'signin.html';
      }
    }
  });
   
  function deleteTask(userId, taskId) {
    database.ref('tasks/' + userId + '/' + taskId).remove()
      .then(function() {
        var taskElement = document.getElementById(taskId);
        if (taskElement) {
          taskElement.remove();
        }
      })
      .catch(function(error) {
        console.log('Error deleting task: ', error);
      });
  }
  


  // Event listener for Firebase "child_removed" event
  database.ref('tasks').on('child_removed', function(snapshot) {
    var taskId = snapshot.key;
    var taskElement = document.getElementById(taskId);
    if (taskElement) {
      taskList.removeChild(taskElement);
    }
  });
  
 // Event listener for "Delete All" button
deleteAllBtn.addEventListener('click', function() {
    var user = firebase.auth().currentUser;
    if (user) {
      // Remove all tasks from Firebase database
      database.ref('tasks/' + user.uid).remove()
        .then(function() {
          taskList.innerHTML = ''; // Clear the task list on success
        })
        .catch(function(error) {
          console.log('Error deleting tasks: ', error);
        });
    }
  });
  
  
  // Event listener for "Sign Out" button
  signOutBtn.addEventListener('click', function() {
    firebase.auth().signOut();
  });
  
  // Event listener for edit button
  taskList.addEventListener('click', function(event) {
    var target = event.target;
    if (target.classList.contains('edit-btn')) {
      var taskId = target.parentNode.id;
      var taskElement = document.getElementById(taskId);
      var taskText = taskElement.querySelector('.task-text');
  
      // Open the edit modal and pre-fill the input field with the existing task
      var editModal = document.getElementById('editModal');
      var editTaskInput = document.getElementById('edit-task-input');
      editTaskInput.value = taskText.innerText;
      editModal.style.display = 'block';
  
      // Event listener for close button in the edit modal
      var closeBtn = editModal.querySelector('.close');
      closeBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
      });
  
      // Event listener for save button in the edit modal
      var saveEditBtn = document.getElementById('save-edit-btn');
      saveEditBtn.addEventListener('click', function() {
        var newTask = editTaskInput.value.trim();
        if (newTask !== '') {
          // Update thetask in Firebase database
          database.ref('tasks/' + user.uid).child(taskId).update({
            task: newTask
          });
          taskText.innerText = newTask;
          editModal.style.display = 'none';
        }
      });
    }
  });
  function createTaskElement(task, taskId) {
    var li = document.createElement('li');
    li.id = taskId;
  
    var taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.innerText = task;
    li.appendChild(taskText);
  
    var editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    li.appendChild(editBtn);
  
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.setAttribute('data-task-id', taskId); // Add taskId as a data attribute
    li.appendChild(deleteBtn);
  
    taskList.appendChild(li);
  }
  
  
  // Event listener for Firebase "child_removed" event
  database.ref('tasks').on('child_removed', function(snapshot) {
    var taskId = snapshot.key;
    var taskElement = document.getElementById(taskId);
    if (taskElement) {
      taskList.removeChild(taskElement);
    }
  });
  