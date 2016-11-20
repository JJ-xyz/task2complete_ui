(function(){
  angular
	.module("task2complete")
	.controller("ApiController", ApiController);

	function ApiController($http, $state){

		var self = this;
    // var rootUrl = "https://task2complete-api.herokuapp.com";  // API heroku url
    var rootUrl = "http://localhost:3000";  // API local url

    self.signup = signup;
    self.login = login;
    self.logout = logout;
    self.myProfile = myProfile;
    self.myUpdate = myUpdate;
    self.getAllTasks = getAllTasks;
    // *** for second pass review ***
    // self.myPendingTasks = myPendingTasks;
    // self.myDelegatedTasks = myDelegatedTasks;
    self.getOneTask = getOneTask;
    self.deleteOneTask = deleteOneTask;
    self.createTask = createTask;
    self.newTask = newTask;
    self.updateTask = updateTask;
    self.partialTitle = ''
    self.enote = '';
    self.currentUser = localStorage.activeUsername;



    if (self.currentUser) {
      getUserList();
      getAllTasks();
      $state.go('indexAll', {url: "/", templateUrl: "partials/tasks.html"} );
    } else {
      logout();
      $state.go('home', { url: "/login", templateUrl: "partials/login.html"} );
    };





    // *** for second pass review ***
    // myPendingTasks();
    // myDelegatedTasks();

    // *-------------------------------------------------------------*
    // * Application Section --- No separation of concenrs yet       *
    // *-------------------------------------------------------------*

    // --- getAllTasks ---
    function getAllTasks(){
      $http({
        method: 'GET',
        url: `${rootUrl}/api/tasks`,
        data: {},
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        self.taskList = response.data;
        console.log("RESPONSE-getAllTasks", response.data);
      })
      .then(function() {
        getUserList();
      })
      .then(function(userpack) {
        for (i=0; i<self.taskList.length; i++) {

          var personId = self.taskList[i].assigned_to;
          console.log("++++personId+++1+", personId);
          var y = self.allUsers.findIndex(function(e) {return personId === e.id});
          console.log("-------y-------1-", y);
          self.taskList[i].assigned_to_name = self.allUsers[y].username;
          console.log("======name=====1=", self.taskList[i].assigned_to_name );

          var personId = self.taskList[i].assigned_by;
          console.log("++++personId+++2+", personId);
          var y = self.allUsers.findIndex(function(e) {return personId === e.id});
          console.log("-------y-------2-", y);
          self.taskList[i].assigned_by_name = self.allUsers[y].username;
          console.log("======name=====2=", self.taskList[i].assigned_by_name );

        }
      })
      .catch((err) => { console.log(err) });
    }

    // --- myPendingTasks ---
    function myPendingTasks(){
      self.pendingTasks = self.taskList.filter(function(x){ return x.assigned_to == localStorage.activeUserIdid; })
      return self.pendingTasks;
    }

    // --- myDelegatedTasks ---
    function myDelegatedTasks(){
      self.delegatedTasks = self.taskList.filter(function(x){ return x.assigned_by == localStorage.activeUserIdid; })
      return self.pendingTasks;
    }

    // --- getUserList ---
    function getUserList(){
      $http({
        method: 'GET',
        url: `${rootUrl}/api/users`,
        data: {},
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        self.allUsers = response.data;
        console.log("XXXXXXXXX the user list is ", self.allUsers);
      })
      .catch((err) => { console.log(err) });
    }

    // --- newTask ---
    function newTask(i){
      console.log(`getOneTask function call for next line`);      // test - 2B deleted
      getUserList();
      self.partialTitle = "Add New Task";
      self.detail = '';
        // self.detail.theUser = '';
      $state.go('taskNew');
    }

    // --- createTask ---
    function createTask(detail){
      console.log(`createTask function call from newTask`);      // test - 2B deleted
      console.log("PASSED detail", detail);                      // test - 2B deleted
      var fdate = new Date();

      $http({
        method: 'POST',
        url: `${rootUrl}/api/tasks`,
        data: {
          name: detail.name,
          description: detail.description,
          assigned_by: localStorage.activeUserId,
          assigned_to: detail.theUser.id,
          date_assigned: new Date(),
          date_due: detail.date_due,
          is_complete: false
        },
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        console.log("RESPONSE-createTask", response.data);                 // test - 2B deleted
        self.taskOne = response.data;

        var personId = self.taskOne.assigned_to;
        console.log("++u++personId+++1+", personId);
        var y = self.allUsers.findIndex(function(e) {return personId === e.id});
        console.log("--u-----y-------1-", y);
        self.taskOne.assigned_to_name = self.allUsers[y].username;
        console.log("==u====name=====1=", self.taskOne.assigned_to_name );

        var personId = self.taskOne.assigned_by;
        console.log("++u++personId+++2+", personId);
        var y = self.allUsers.findIndex(function(e) {return personId === e.id});
        console.log("--u-----y-------2-", y);
        self.taskOne.assigned_by_name = self.allUsers[y].username;
        console.log("==u====name=====2=", self.taskOne.assigned_by_name );



        self.taskList.push(response.data);
        self.detail = '';


        $state.go('indexAll');
      })
      .catch((err) => { console.log(err) });
    }


    // --- getOneTask ---
    function getOneTask(i){
      console.log(`getOneTask function call for line ${i}`);
      $http({
        method: 'GET',
        url: `${rootUrl}/api/tasks/${self.taskList[i].id}`,
        data: {},
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        response.data.date_due = new Date(response.data.date_due);
        self.taskOne = response.data;
        console.log("RESPONSE-getOneTask", response.data);
        console.log("XXXXXXXXX DATE detail", response.data.date_due);                      // test - 2B deleted
        var fdate = new Date();
        console.log("XXXXXXXXX DATE today", fdate);                      // test - 2B deleted

        self.detail = response.data;
        self.detail.theUser = {id : response.data.assigned_to, username: response.data.username}
        self.partialTitle = "Task Details";

        $state.go('taskEdit');
      })
      .catch((err) => { console.log(err) });
    }

    // --- updateTask ---
    function updateTask(detail){
      console.log(`updateTask function call from getOneTask`);      // test - 2B deleted
      console.log("PASSED detail", detail);                      // test - 2B deleted
      $http({
        method: 'PUT',
        url: `${rootUrl}/api/tasks/${self.detail.id}`,
        data: {
          name: detail.name,
          description: detail.description,
          assigned_to: detail.theUser.id,
          date_due: detail.date_due,
          is_complete: detail.is_complete
        },
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        console.log("RESPONSE-updateTask", response.data);                 // test - 2B deleted
        self.taskOne = response.data;

        var personId = self.taskOne.assigned_to;
        console.log("++u++personId+++1+", personId);
        var y = self.allUsers.findIndex(function(e) {return personId === e.id});
        console.log("--u-----y-------1-", y);
        self.taskOne.assigned_to_name = self.allUsers[y].username;
        console.log("==u====name=====1=", self.taskOne.assigned_to_name );

        var personId = self.taskOne.assigned_by;
        console.log("++u++personId+++2+", personId);
        var y = self.allUsers.findIndex(function(e) {return personId === e.id});
        console.log("--u-----y-------2-", y);
        self.taskOne.assigned_by_name = self.allUsers[y].username;
        console.log("==u====name=====2=", self.taskOne.assigned_by_name );


        var x = self.taskList.findIndex(function(e) {return e.id === response.data.id});
        self.taskList[x] = response.data;
        self.detail = '';

        $state.go('indexAll');
      })
      .catch((err) => { console.log(err) });
    }

    // --- deleteOneTask ---
    function deleteOneTask(i){
      console.log(`deleteOneTask function call line ${i}`);
      $http({
        method: 'DELETE',
        url: `${rootUrl}/api/tasks/${self.taskList[i].id}`,
        data: {},
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response){
        console.log("RESPONSE-deleteOneTask", response.data);         // test - 2B deleted
        self.taskList.splice(i,1);

        $state.go('indexAll');
      })
      .catch((err) => { console.log(err) });

    }




    // *-------------------------------------------------------------*
    // * Authorization Section --- No separation of concenrs yet     *
    // *-------------------------------------------------------------*

    // --- Login process, set local storage
    function login(userPass) {
      self.enote = '';
      console.log("login userFromAngular>>>", userPass);        // test - 2B deleted
      $http({
        method: 'POST',
        url: `${rootUrl}/api/users/login`,
        data: {user: {username: userPass.username, password: userPass.password}},
        responseType: 'json'
      })
      .then(function(response) {
        if (response.data.token) {
          self.currentUser = userPass.username;
          localStorage.setItem('activeUsername', userPass.username);
          localStorage.setItem('activeToken', response.data.token);
          localStorage.setItem('activeUserId', response.data.user.id);
          console.log("RESPONSE", response);                          // test - 2B deleted

          getAllTasks();
          $state.go('indexAll');

        } else {
          console.log("RESPONSE", response);                          // test - 2B deleted
          self.currentUser = '';
          localStorage.setItem('activeUsername', '');
          localStorage.setItem('activeToken', '');
          localStorage.setItem('activeUserId', '');

          self.enote = response.data.message;
        }
        console.log("The user is>>>",userPass.username);              // test - 2B deleted
        console.log("The user_id is>>>", response.data.user.id)       // test - 2B deleted
        console.log("The token is>>>", response.data.token)           // test - 2B deleted
      })
      .catch((err) => {
        console.log(err);
      });
    };

     // --- logout process, clear local storage
    function logout() {
       self.currentUser = '';
       localStorage.setItem('activeUsername', '');
       localStorage.setItem('activeToken', '');
       localStorage.setItem('activeUserId', '');

       $state.go('home')
    };

    // --- profile display, for profile edit
    function myProfile(account) {
      $http({
        method: 'GET',
        url: `${rootUrl}/api/users/${localStorage.activeUserId}`,
        data: {username: localStorage.activeUsername},
        headers: {Authorization: `Bearer ${localStorage.activeToken}`},
        responseType: 'json'
      })
      .then(function(response) {
        self.account = {
          email: response.data.user.email,
          e_confirmed: response.data.user.e_confirmed,
          wantPasswordChange: false
        }
      })
      .catch((err) => {
        console.log(err);
      });
      $state.go('user')
    };

     // --- signup process, create account
    function signup(account) {
      console.log("accountFromAngular>>>", account);      // test - 2B deleted
      $http({
        method: 'POST',
        url: `${rootUrl}/api/users`,
        data: {
          username: account.username,
          password: account.password,
          email: account.email,
          e_confirmed: account.e_confirmed },   // temp until second pass
        responseType: 'json'
      })
      .then(function(response) {
        console.log("RESPONSE signup>>>",account.username);     // test - 2B deleted
        $state.go('home')
      })
      .catch((err) => {
        console.log(err);
      });
     }

     // --- update process, update user profile
    function myUpdate(account) {
      console.log("accountFromAngular>>>", account);      // test - 2B deleted
      self.enote = '';
      if (self.account.wantPasswordChange) {
        self.enote = 'Sorry, no password change allowed';
        $state.go('user');
        // may complete on second pass - now: no password change allowed
      } else {
        $http({
          method: 'PUT',
          url: `${rootUrl}/api/users/${localStorage.activeUserId}`,
          data: {email: self.account.email, e_confirmed: self.account.e_confirmed},   // temp until second pass
          headers: {Authorization: `Bearer ${localStorage.activeToken}`},
          responseType: 'json'
          })
        .then(function(response) {
          console.log("RESPONSE", response);     // test - 2B deleted
          $state.go('indexAll')
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }

	}

})()
