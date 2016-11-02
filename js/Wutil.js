const DIRECTION = {
    DOWN: 'down',
    UP: 'up',
    LEFT: 'left',
    RIGHT: 'right'
};

const verticalDiffThreshold = 0.1;

window.W = {
    
    randomInt: function(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    roundDecimal: function(decimal, hops){
	    var n = hops === 0 ? 0 : hops || 2;
	    return +(decimal.toFixed(n));
    },
    distance: function(a, b) {
        return Phaser.Math.distance(
            a.position.x,
            a.position.y,
            b.position.x,
            b.position.y
        );
    },
    spriteDistance: function(a, b) {
        return Phaser.Math.distance(
            a.sprite.position.x,
            a.sprite.position.y,
            b.sprite.position.x,
            b.sprite.position.y
        );
    },
    lookTarget: function(iTargetable) {
        // curry: findTarget.call(self, theTarget)
        if(!iTargetable.position)
            console.warn('cannot find target on an abject that does not have the "position" property!');
            
        var dir = DIRECTION.RIGHT;
        
        dir = this.position.x < iTargetable.position.x ? DIRECTION.RIGHT : DIRECTION.LEFT;
        
        return dir;
    },
    isMoving: function(iSprite){
        return iSprite.sprite.position.x !== iSprite.sprite.previousPosition.x
            || iSprite.sprite.position.y !== iSprite.sprite.previousPosition.y;
    },
    isMovingVertical: function(iSprite, threshold){
        return Math.abs(iSprite.sprite.position.y - iSprite.sprite.previousPosition.y) > (threshold || 2.5);
    }
};