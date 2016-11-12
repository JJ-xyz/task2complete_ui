(function(){
  angular
	.module("task2complete")
	.controller("ApiController", ApiController);

	function ApiController($http, $state){

		var self = this;
    var rootUrl = "http://localhost:3000";  // API url

    self.signup = signup;
    self.login = login;
    self.logout = logout;
    self.enote = '';


    // *-------------------------------------------------------------*
    // * Application Section --- No separation of concenrs yet       *
    // *-------------------------------------------------------------*





    // *-------------------------------------------------------------*
    // * Authorization Section --- No separation of concenrs yet     *
    // *-------------------------------------------------------------*

    // --- Login process, set local storage
    function login(userPass) {
      console.log("userFromAngular>>>", userPass);        // test - 2B deleted
      $http({
        method: 'POST',
        url: `${rootUrl}/api/users/login`,
        data: {username: userPass.username, password: userPass.password},
        responseType: 'json'
      })
      .then(function(response) {
        if (response.data.token) {
          self.currentUser = userPass.username;
          localStorage.setItem('activeUsername', userPass.username);
          localStorage.setItem('activeToken', response.data.token);

          $state.go('indexAll', {url: '/', token: response.data.token});  // temp - token
        } else {
          console.log("RESPONSE", response);
          self.currentUser = '';
          localStorage.setItem('activeUsername', '');
          localStorage.setItem('activeToken', '');
          self.enote = response.data.message;
        }
        console.log("The user is>>>",userPass.username);              // test - 2B deleted
        console.log("The token is>>>", response.data.token)           // test - 2B deleted
      })
      .catch((err) => {
        console.log(err);
      });
     }

     // --- logout process, clear local storage
     function logout() {
       self.currentUser = '';
       localStorage.setItem('activeUsername', '');
       localStorage.setItem('activeToken', '');
       $state.go('home')
      }

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
          console.log("The user is>>>",account.username);     // test - 2B deleted
          $state.go('home')
        })
        .catch((err) => {
          console.log(err);
        });
       }

	}

})()
