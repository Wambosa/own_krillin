function SuperWarrior(options){
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
        ki: options.ki || 25
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
    this.isControlled = options.isControlled;
    this.progress = 0;
    this.facing = options.direction || 'right';
    this.target = options.target;
    
    // hack
    this.body = this.sprite.body;
    
    return this;
}


SuperWarrior.prototype = {
    
    update: function() {
        this.animate();
        
        // hacks for AI. move out of here and into updateable later
        if(this.target && this.performing('stand')) {
            var dir = W.lookTarget.call(this.sprite, this.target);
            this.sprite.scale.x = dir == 'right' ? 1 : -1;
        }
        
        if(this.performing('dash'))
            this.sprite.scale.x = this.direction() == 'right' ? 1 : -1;
    },
    
    percentOf: function(statName) {
        return W.roundDecimal(100 * (this.stats[statName] / this.baseFormStats[statName]));
    },
    
    direction: function() {
        var horizontalDiff = Math.abs(this.sprite.position.x - this.sprite.previousPosition.x);
        
        if(horizontalDiff)
            this.facing = this.sprite.position.x > this.sprite.previousPosition.x ? DIRECTION.RIGHT : DIRECTION.LEFT;
        
        return this.facing;
    },
    
    buildAnimationFrames: function(animations){
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
    },
    
    performing: function(animationName) {
        return animationName == this.sprite.animations.currentAnim.name;
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
    }
    
};