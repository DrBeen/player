/* 
   MODULE: INFO
   Show title and description for the video
   
   Listens for:
   - player:settings: The app was loaded, time to show the info pane
   - player:video:loaded: New title and description to show
   
   Answers properties:
   - showInfo [get/set]
*/

Glue.provide('info', 
  {},
  function(Glue,$,opts){
      var $this = this;
      $.extend($this, opts);
      
      // Listen to find if we show show info
      Glue.bind('player:settings', function(e,settings){
          if(typeof(settings.showInfo)!='undefined') $this.showInfo = settings.showInfo;
        });

      // Bind to events
      Glue.bind('player:video:loaded', function(e,video){
          $this.render();
        });

      /* GETTERS */
      Glue.getter('showInfo', function(){
          return (typeof($this.showLogo)=='undefined'||($this.showLogo&&$this.showLogo!='0'));
        });
     
      /* SETTERS */
      Glue.setter('showInfo', function(si){
          $this.showLogo = si;
          $this.render();
        });

      return $this;
  }
);
