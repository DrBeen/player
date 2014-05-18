/* 
   MODULE: ACCESSIBILITY
   Utility module to handle accessibility interaction with the player.

  Answers properties:
  - moduleFocus [set]
  - focus [set]
*/

Player.provide('accessibility', 
  {
  },
  function(Player,$,opts){
    var $this = this;
    $.extend($this, opts);
    
    /* EVENT HANDLERS */
    var _togglePlayback = function(){}
    $this.loadShortcuts = function(){
      // Handle keyboard events
      $(document).keypress(function(e){
        try {if(Player.get('videoActionPlaying')) return;} catch(e){}
        if(!e.ctrlKey && !e.altKey && !e.metaKey) {
          var matched = false;

          // Click action element
          if(e.charCode==32 || e.keyCode==13 || e.keyCode==32) {
            if($(document.activeElement).is('body')) {
              // No explicit focus is set, toggle playback.
              Player.set('playing', !Player.get('playing'));
            } else {
              // We assume that the Glue item will be r-erendered after click.
              // To accomocate for this, we remember the glue container for the item
              // and reestablish focus afterwards.
              var glueParent = $(document.activeElement).parent('.glue-element');
              $(document.activeElement).click();
              window.setTimeout(function(){
                Player.set('focus', glueParent);
              }, 100);
            }
            matched = true;
          }

          // Mute on 0 press
          if(e.charCode==48 || e.keyCode==48) {
            Player.set('volume', 0);
            matched = true;
          }
          // Full volume on 1 press
          if(e.charCode==49 || e.keyCode==49) {
            Player.set('volume', 1);
            matched = true;
          }
          if (matched) e.preventDefault();
        }
      });
      $(document).keydown(function(e){
        try {if(Player.get('videoActionPlaying')) return;} catch(e){}
        if(!e.ctrlKey && !e.altKey && !e.metaKey) {
          var matched = false;
          // Increase volume on +/up
          if(e.charCode==43 || e.keyCode==38) {
            Player.set('volume', Player.get('volume')+0.2);
            matched = true;
          }
          // Decrease volume on -/down
          if(e.charCode==45 || e.keyCode==40) {
            Player.set('volume', Player.get('volume')-0.2);
            matched = true;
          }
          // Scrub on right arrow
          if(e.keyCode==39) {
            Player.set('currentTime', Player.get('currentTime')+30);
            matched = true;
          }
          // Scrub on left arrow
          if(e.keyCode==37) {
            Player.set('currentTime', Player.get('currentTime')-30);
            matched = true;
          }
          // Disable tray timeout on tab
          if(e.keyCode==9) {
            $('body').addClass('tabbed');
            Player.set('showTray', true);
            Player.set('trayTimeout', 0);
          }

          if(matched) e.preventDefault();
        }
      });
    }


    /* SETTERS: Handle element focus */
    Player.setter('focus', function(el){
      if($(el).is('[tabindex]')) {
        $(el).focus();
      } else {
        $(el).children('*[tabindex]').focus();
      }
    });

    Player.setter('moduleFocus', function(module){
      // If module is passed in by string, find the correct container;
      if(typeof module.container == 'undefined') {
        $.each(Player.modules, function(i,m){
          if(m.moduleName == module) {
            module = m;
            return false;
          }
        });
      }
      if(typeof module.container != 'undefined') {
        Player.set('focus', module.container);
      }
    });


    $this.loadShortcuts();
    return $this;
  }
);
