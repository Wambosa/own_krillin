function SuperWarrior(options) {
    if(this == window)
        throw "you fool! use 'new' keyword"
        
    if(!options.context)
        console.warn('no game context was passed into SuperWarrior '+options.name);
    
    this.context = options.context || game;
    this.name = options.name;
    
    // stats
    this.baseFormStats = {
        speed: options.speed || 100,
        power: options.power || 50,
        hp: options.hp || 100,
        ki: options.ki || 25
    };
    
    this.stats = {
        speed: options.speed || 100,
        power: options.power || 50,
        hp: options.hp || 100,
        ki: options.ki || 25,
        
        moveSpeed: 0,
        kiRegen: this.baseFormStats.ki * .005, //temp
    };
    
    // visual
    this.animFrames = this.buildAnimationFrames(options.animations);
    this.sprite = this.context.add.sprite(
        options.x || 45,
        options.y || 215,
        options.atlas || 'dbz',
        this.animFrames.stand
    );
    this.sprite.anchor.setTo(.5, 1);
    
    this.sprite.animations.add('stand', this.animFrames.stand, 1);
    this.sprite.animations.add('dash', this.animFrames.dash, 1);
    this.sprite.animations.add('fall', this.animFrames.fall, 1);
    this.sprite.animations.add('kick', this.animFrames.kick, 9, true);
    this.sprite.play('stand');
    
    if(options.direction)
        this.sprite.scale.x = options.direction == 'left' ? -1 : 1;
    
    // physics
    this.context.physics.arcade.enable(this.sprite);
    
    if(options.collideWorldBounds === undefined)
        this.sprite.body.collideWorldBounds = true;
    
    // AI
    this.ai = options.ai;
    this.progress = 0;
    this.facing = options.direction || 'right';
    this.target = options.target;
    
    // hack
    this.body = this.sprite.body;
    this.isFinisherMode = false;
    
    return this;
}


SuperWarrior.prototype = {
    
    update: function() {
        this.animate();
        
        // todo: move out of update and into slower timed cycle with larger regen rate
        // future: ki% determines finisher type used on krillin
        if(this.stats.ki < this.baseFormStats.ki)
            this.stats.ki += this.stats.kiRegen;
        
        //execute ai cycle. may need to take out of main update loop? seperate animation speed from ai loop speed
        if(this.ai)
            this.ai();
    },
    
    percentOf: function(statName, isPrecise) {
        return W.roundDecimal(100 * (this.stats[statName] / this.baseFormStats[statName]), isPrecise && 2 || 0);
    },
    
    between: function(min, max) {
        var x = this.sprite.position.x;
        return x <= max && x >= min;
    },
    
    direction: function() {
        var horizontalDiff = Math.abs(this.sprite.position.x - this.sprite.previousPosition.x);
        
        if(horizontalDiff)
            this.facing = this.sprite.position.x > this.sprite.previousPosition.x ? DIRECTION.RIGHT : DIRECTION.LEFT;
        
        return this.facing;
    },
    
    buildAnimationFrames: function(animations) {
        // todo: support variant frame counts per action.
        // example: some characters kick is 3 frames instead of 2
        return {
          stand: ['lsw_'+this.name+'_stand'],
          dash: ['lsw_'+this.name+'_dash'],
          fall: ['lsw_'+this.name+'_fall'],
          kick: ['lsw_'+this.name+'_kick', 'lsw_'+this.name+'_kick2'],
          afterImage: ['lsw_'+this.name+'_blur', 'lsw_dodge', 'lsw_dodge2', 'lsw_dodge', 'lsw_dodge']
        };
    },
    
    animate: function() {
        
        if(W.isMovingVertical(this, 3))
            this.sprite.play('fall');
        else if(this.sprite.body.velocity.x != 0)
            this.sprite.play('dash');
        else if(this.sprite.body.touching.down)
            this.sprite.play('stand');
            
        if(this.target && this.performing('stand')) {
            var dir = W.lookTarget.call(this.sprite, this.target);
            this.sprite.scale.x = dir == 'right' ? 1 : -1;
        }
        
        if(this.performing('dash'))
            this.sprite.scale.x = this.direction() == 'right' ? 1 : -1;  
    },
    
    performing: function(animationName) {
        return animationName == this.sprite.animations.currentAnim.name;
    },
    
    can: function(actionName) {
        var self = this;
        
        var todo = {
            move: function(){
                // todo: think about what will imobilize the player later
                return true;
            },
            dodge: function() {
                return self.body.touching.down && self.stats.ki >= 100;
            }
        };
        
        return (!self.isFinisherMode && todo[actionName]) && todo[actionName]();
    },
    
    dodge: function(options) {
        
        var x = options.x || 0;
        var y = options.y || 0;
        
        var afterImage = this.context.add.sprite(
        this.sprite.position.x, 
        this.sprite.position.y,
        'dbz',
        'lsw_dodge'
      );
      
      afterImage.anchor.setTo(.5, 1);
      afterImage.scale.x = this.sprite.scale.x;
      afterImage.animations.add('a', this.animFrames.afterImage, 22, false);
      afterImage.play('a', false, false, true);
      
      this.sprite.position.add(x, y);
      // future: fixed cost for snap, yet more powerful villians can hover by holding up which quickly drains ki
      this.stats.ki -= 100;
    }
};