(function() {

  angular
    .module('starter', ['ionic', 'plangular'])
    .config(function(plangularConfigProvider) {
      plangularConfigProvider.clientId = '5fd371b0c0d2c54f6de733c69c25105b';
    })
    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        return window.StatusBar && StatusBar.styleDefault();
      });
    })
    .controller('PlaybackController', function($ionicPlatform) {
      var vm = this;
      
      /**
      * @description helper function for next/prev functionality
      * @return {number} current track index
      */
      var getCurrentTrackIndex = function(track) {
        return vm.tracks.findIndex(function(_track) {
          return track.id === _track.id;
        }) || null;
      };

      /**
      * @description here you can track player status
      * @link http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/index.html#constants
      */
      var handleStatusChange = function(status) {
        if (status === Media.MEDIA_RUNNING) {
          console.log('Now playing', vm.track.title);
        }
      };

      /**
      * @description here you can handle controls in notifications or lock-screen
      */
      var handleMusicControls = function(action) {
        switch(action) {
          case 'music-controls-next':
            return vm.next();
          case 'music-controls-previous':
            return vm.prev();
          case 'music-controls-pause':
            return vm.pause();
          case 'music-controls-play':
            return vm.play();
          case 'music-controls-destroy':
            return vm.reset();

          // Headset events (Android only)
          case 'music-controls-media-button' :
            return null;
          case 'music-controls-headset-unplugged':
            return null;
          case 'music-controls-headset-plugged':
            return null;

          default:
            return null;
        }
      }

      var getMediaInstance = function(src) {
        return new Media(src, null, null, handleStatusChange);
      };

      /**
      * @description creates controls in notifications pane and lock-screen
      * @link https://github.com/homerours/cordova-music-controls-plugin#methods
      */
      var createMusicControls = function(track) {
        return MusicControls.create({
          track: track.title,
          artist: track.user,
          ticker: `Now playing ${ track.title }`,
          dismissable : true
        });
      };

      vm.tracks = [];
      vm.track = null;
      vm.currentTrackMeta = null;

      vm.addTrack = function(track) {
        return vm.tracks.push({
          id: track.id,
          user: track.user.username,
          title: track.title,
          src: track.src,
          duration: track.duration
        });
      };

      vm.play = function(index) {
        if (index != null) {
          MusicControls.destroy();

          createMusicControls(vm.tracks[index]);

          vm.track != null && vm.track.stop();

          vm.track = getMediaInstance(vm.tracks[index].src);
          vm.currentTrackMeta = vm.tracks[index]; 
        } else {
          MusicControls.updateIsPlaying(true);
        }

        return vm.track.play();
      };

      vm.pause = function() {
        MusicControls.updateIsPlaying(false);
        vm.track != null && vm.track.pause();
      };

      vm.next = function() {
        var currentTrackIndex = getCurrentTrackIndex(vm.currentTrackMeta);
        return vm.play((currentTrackIndex + 1) >= vm.tracks.length ? 0 : currentTrackIndex + 1);
      };

      vm.prev = function() {
        var currentTrackIndex = getCurrentTrackIndex(vm.currentTrackMeta);
        return vm.play((currentTrackIndex - 1) <= 0 ? vm.tracks.length - 1 : currentTrackIndex - 1);
      };

      vm.reset = function() {
        vm.track.stop();
        vm.track = null;
      }

      $ionicPlatform.ready(function() {
        MusicControls.subscribe(handleMusicControls);
        MusicControls.listen();
      });
    })

})();