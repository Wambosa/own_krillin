function UpdateManager(options){
    var self = this;
    
    var context = options.context;

    this.frequency = options.frequency|| 60;
    
    this.everyFrame = [];
    
    this.timedFrame = [];
    
    this.add = function(obj, delay){
        if(obj.update) {
          
          if(delay)
            self.timedFrame.push({
              name: obj.name,
              type: 'todo',
              loop: context.time.events.loop(delay, obj.update.bind(obj))
            });
          else
            self.everyFrame.push(obj);
     
        }else{
          console.warn("Tried to add a game object that does NOT honor IUpdateable! name of object: "+obj.name);
        }
    };
    
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