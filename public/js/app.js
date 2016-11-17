(function() {
  angular
	  .module('task2complete', ['ui.router'])
    .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function MainRouter($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('indexAll', {
        url: "/tasks",
        templateUrl: "partials/tasks.html",
      })
      .state('home', {
        url: "/login",
        templateUrl: "partials/login.html",
      })
      .state('indexTo', {
        url: "/tasks",
        templateUrl: "partials/tasks.html",
      })
      .state('indexBy', {
        url: "/tasks",
        templateUrl: "partials/tasks.html",
      })
      .state('logout', {
        url: "/login",
        templateUrl: "partials/login.html",
      })
      .state('user', {
        url: "/user",
        templateUrl: "partials/user.html",
      })
      .state('signup', {
        url: "/signup",
        templateUrl: "partials/signup.html",
      })
      .state('taskNew', {
        url: "/tasknew",
        templateUrl: "partials/tasknew.html",
      })
      .state('taskEdit', {
        url: "/taskedit",
        templateUrl: "partials/taskedit.html",
      });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
})()
