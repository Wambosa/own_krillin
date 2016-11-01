// this class should represent generic keyboard & touch inputs
// it should be a single interface for both interactions

function DualInput(context){
  var self = this;
  
  this.cursors = context.input.keyboard.createCursorKeys();
  this.touch = {
      'up': null,
      'down': null,
      'left': null,
      'right': null
  };
  
  var keys = [];
  
  this.if = function(key, isInverted) {
    
    var down = (this.touch[key] && this.touch[key].isDown) 
        || (this.cursors[key] && this.cursors[key].isDown);
    
      return isInverted && !down || down;
  }
  
  this.on = function(key, pressMode, func) {
    //add to events of key
  }
  
  this.button = function(options){
      keys.push(options.key);
      var key = options.key;
      var spriteName = options.spriteName;
      
      var x = options.x;
      var y = options.y;
      var flipX = options.flipX;
      var flipY = options.flipY;
      var scale = options.scale || 1;
      var alpha = options.alpha || .5;
      var anchorX = options.anchorX || 0;
      var anchorY = options.anchorY || 1;
    
      var b = context.add.button(x, y, spriteName);
      this.touch[key] = b;
      
      b.anchor.setTo(anchorX, anchorY);
      b.alpha = alpha;
      b.scale.setTo(scale);
      
      if(flipX)
        b.scale.x *= -1;
        
      if(flipY)
        b.scale.y *= -1;
        
      b.fixedToCamera = true;
      
      function defaultbuttonDown(){b.isDown = true;}
      function defaultbuttonRelease(){b.isDown = false;}
      
      b.events.onInputDown.add(options.onDown || defaultbuttonDown);
      b.events.onInputOut.add(options.onUp || defaultbuttonRelease);
      b.events.onInputUp.add(options.onUp || defaultbuttonRelease);
      
      b.condition = options.condition || function(){return true;}
      
      return b;
  }
  
  this.update = function() {
    keys.forEach(function(k) {
      var icon = self.touch[k];
      icon.visible = icon.condition();
    });
  }
  
  this.listen = function(){
    //start the update listen
  }
  this.stop = function(){
    //halt the update
  }
  
  return this;
}