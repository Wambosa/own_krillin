function UpdateManager(options) {
    var self = this;
    
    var context = options.context;

    this.frequency = options.frequency|| 60;
    
    this.everyFrame = [];
    
    this.timedFrame = [];
    
    this.once = function(condition, func, delay) {
      var randName = (new Date).getTime();
      self.timedFrame.push({
        name: randName,
        type: 'once',
        loop: context.time.events.loop(delay || Phaser.Timer.SECOND, function() {
          if(condition()){
            func();
            self.remove(randName);
          }
        })
      });
    }
    
    this.add = function(obj, delay) {
        if(obj.update) {
          
          if(delay)
            self.timedFrame.push({
              name: obj.name,
              type: 'timed',
              loop: context.time.events.loop(delay, obj.update.bind(obj))
            });
          else
            self.everyFrame.push(obj);
     
        }else{
          console.warn("Tried to add a game object that does NOT honor IUpdateable! name of object: "+obj.name);
        }
    };
    
    this.remove = function(name){
      for(var i=0; i<self.timedFrame.length;i++){
        if(self.timedFrame[i].name === name){
          context.time.events.remove(self.timedFrame[i].loop);
          self.timedFrame.pop(i);
          break;
        }
      }
    }
    
    var sequence = 0;
    var updatesPerSecond = Math.round(60 / this.frequency);
    
    this.update = function() {
        if(++sequence % updatesPerSecond === 0)
            self.everyFrame.forEach(function(u){
              u.update.call(u);
            });
    };
    
    return this;
}