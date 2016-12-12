(function() {

  angular
    .module('starter', ['ionic', 'plangular'])
    .config(function(plangularConfigProvider) {
      plangularConfigProvider.clientId = '5fd371b0c0d2c54f6de733c69c25105b';
    })
    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    });

})();