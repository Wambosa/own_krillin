cheat = null;

var GameState = {

  init: function() {
    cheat = this;
    this.game.renderer.renderSession.roundPixels = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = EARTHGRAVITY;
    this.game.world.setBounds(0, 0, 568, 320);
    
    this.dualInput = new DualInput(this.game);
    this.updateMan = new UpdateManager({context: this.game});
  },

  preload: function() {
    this.game.load.text('scene1', 'assets/data/scene1.json');
    this.game.load.atlasJSONHash('dbz', 'assets/img/dbz.png', 'assets/data/dbz.json');
    this.game.load.image('platform', 'assets/img/platform.png');
    this.game.load.image('dragonball_arrow', 'assets/img/dragonball_arrow.png');
    this.game.load.image('dragonball_1', 'assets/img/dragonball_1.png');
    this.game.load.image('dragonball_2', 'assets/img/dragonball_2.png');
    this.game.load.image('dragonball_own', 'assets/img/dragonball_own.png');
    this.game.load.image('owned_count', 'assets/img/ownedcount.jpg');
    this.game.load.image('vs', 'assets/img/vs.png');
    this.game.load.image('bar', 'assets/img/bar.png');

    this.game.load.image('icon_afterimage', 'assets/img/icon_afterimage.png');
    this.game.load.image('icon_avoiding', 'assets/img/icon_avoiding.png');
    this.game.load.image('icon_bulma', 'assets/img/icon_bulma.png');
    this.game.load.image('icon_destructoDisk', 'assets/img/icon_destructoDisk.png');
    this.game.load.image('icon_lightVest', 'assets/img/icon_lightVest.png');
    this.game.load.image('icon_scouter', 'assets/img/icon_scouter.png');
    this.game.load.image('icon_tail', 'assets/img/icon_tail.png');
  },

  createOnSCreenControls: function() {
    var self = this;
    
    this.dualInput.button({
      key: 'left',
      spriteName: 'dragonball_arrow',
      x: 85,
      y: 320,
      scale: .6,
      flipX: true
    });
    
    this.dualInput.button({
      key: 'right',
      spriteName: 'dragonball_arrow',
      x: 86,
      y: 320,
      scale: .6
    });
    
    this.dualInput.button({
      key: 'up',
      spriteName: 'dragonball_1',
      x: 440,
      y: 320,
      scale: .6
    });
    
    this.dualInput.button({
      key: 'down',
      spriteName: 'dragonball_own',
      x: 440,
      y: 320,
      scale: .6
    });
  },

  create: function() {
    var self = this;
    this.sceneData = JSON.parse(this.game.cache.getText('scene1'));
    
    
    this.background = this.game.add.sprite(
      this.sceneData.background.xOffset, 
      this.sceneData.background.yOffset,
      'dbz', 
      this.sceneData.background.spriteName
    );
    this.background.scale.setTo(this.sceneData.background.scale.x, this.sceneData.background.scale.y);
    
    
    // hack: strange bug with platform collisions so i doubled up on the y 88 89
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    [
        {"x": 0, "y": 220},
        {"x": 0, "y": 145},
        {"x": 0, "y": 88},
        {"x": 0, "y": 89}
    ].forEach(function(p){
      self.platforms.create(p.x, p.y, 'platform');
    });
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);
    this.platforms.setAll('scale.y', 2);
    this.platforms.setAll('alpha', 0);

    this.createOnSCreenControls();

    // TODO: PICK UP HERE. make UI Man 

    this.healthR = this.game.add.sprite(278, 253, 'bar');
    this.healthR.anchor.setTo(0, .5);
    this.healthR.scale.setTo(-2, .45);
    this.healthR.tint = COLOR.GREEN;
    
    this.healthK = this.game.add.sprite(289, 253, 'bar');
    this.healthK.anchor.setTo(0, .5);
    this.healthK.scale.setTo(2, .45);
    this.healthK.tint = COLOR.GREEN;
    
    this.vs = this.game.add.sprite(285, 240, 'vs');
    this.vs.anchor.setTo(.5, 0);
    this.vs.scale.setTo(.4);
    //
    this.chibiR = this.game.add.sprite(244, 265, 'dbz', 'chibi_raditz');
    this.chibiK = this.game.add.sprite(324, 265, 'dbz', 'chibi_krillin');
    this.chibiK.scale.x = -1;

    this.game.add.sprite(312, 300, 'icon_afterimage').scale.setTo(.75);
    this.game.add.sprite(332, 300, 'icon_lightVest').scale.setTo(.75);
    this.game.add.sprite(352, 300, 'icon_bulma').scale.setTo(.75);
    
    this.game.add.sprite(199, 300, 'icon_tail').scale.setTo(.75);
    this.game.add.sprite(219, 300, 'icon_scouter').scale.setTo(.75);
    this.game.add.sprite(239, 300, 'icon_avoiding').scale.setTo(.75);    
    
    var style = { font: "bold 10px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.textR = game.add.text(200, 270, "100%", style);
    this.textK = game.add.text(344, 270, "100%", style);
    
    
    this.props = [
      this.game.add.sprite(450, 165, 'dbz', 'prop_kame'),
      this.game.add.sprite(385, 165, 'dbz', 'prop_bulma'),
      this.game.add.sprite(395, 175, 'dbz', 'prop_roshi'),
      this.game.add.sprite(405, 180, 'dbz', 'prop_gohan'),
      this.game.add.sprite(370, 165, 'dbz', 'lsw_goku_stand')
    ];
    
    this.props.slice(1).forEach(function(p){
      p.scale.x = -1;
    });
    
    this.villian = new SuperWarrior({
      context: this.game,
      name: this.sceneData.villian,
      hp: 5000,
      power: 1000,
      speed: 175,
      ki: 500,
      x: 90,
      y: 215
    });
    
    this.krillin = new SuperWarrior({
      context: this.game,
      name: "krillin",
      hp: 1000,
      power: 75,
      speed: 145,
      ki: 131,
      x: 225, //325
      y: 215,
      direction: 'left',
      target: this.villian, // ISuperWarrior?
      ai: function() {
        
        this.stats.moveSpeed = 0;
        
        if(self.sceneData.krillinMoves.indexOf('run') > -1) {
          
          // move away from the villian, at least n distance. 
          // when the villian closes on the resting location for the layer, then afterImage up to the next layer and run away
          
          if(W.spriteDistance(this.target, this) < AIBASE.FLEEDISTANCE
            && this.between(XBOUND.LEFT, XBOUND.RIGHT)
            && this.can('move'))
            this.stats.moveSpeed = this.sprite.position.x > this.target.sprite.position.x ? this.stats.speed : -this.stats.speed;
          
          if(this.progress === this.target.progress
            && !this.between(XBOUND.LEFT, XBOUND.RIGHT)
            && W.distance(this.target.sprite, this.sprite) < AIBASE.TOOCLOSE
            && this.can('dodge')) {
            
            var direction = !(this.progress % 2) ? -1 : 1;
            if(++this.progress >= 2 && this.target.progress >= 2)
              this.target.progress = this.progress;
            this.dodge({x: 60*direction, y: -100});
          }
        }
        
        this.body.velocity.x = this.stats.moveSpeed;
      }
    });
    
    // note: the 'own' condition need the villian and krillin to be declared, so that it cannot be set until now
    this.villian.target = this.krillin;
    this.dualInput.touch.down.condition = function() {
      return self.krillin.progress == self.villian.progress 
        && W.distance(self.villian.sprite, self.krillin.sprite) < FINISHERRANGE;
    };
    
    // update manager keeps the updates ordered and clean. currently the super warrior takes care of its own animation.. might change that.
    this.updateMan.add(this.villian);
    this.updateMan.add(this.krillin);
    this.updateMan.add(this.dualInput);
    this.updateMan.add({
      name: 'playerController',
      update: function() {
        
        self.villian.stats.moveSpeed = 0;
        
        if(self.dualInput.if('up') && self.villian.can('dodge')) {
          
          // if krillin is ahead of you, then use your superior powers to catch up!
          if(self.villian.progress < self.krillin.progress) {
            var direction = !(self.villian.progress % 2) ? -1 : 1;
            self.villian.progress++;
            self.villian.dodge({x: 15*direction, y: -100});
          }else{
            self.villian.dodge({y: -50});
          }
          
        }else if(self.villian.can('move')){
          
          if(self.dualInput.if('left'))
            self.villian.stats.moveSpeed -= self.villian.stats.speed;
          
          if(self.dualInput.if('right'))
            self.villian.stats.moveSpeed += self.villian.stats.speed;
        }
        
        self.villian.body.velocity.x = self.villian.stats.moveSpeed;
        
        if(self.dualInput.if('down')){
          
          if(self.villian.isFinisherMode)
            self.krillin.stats.hp-= (self.villian.stats.power*.05);
          
          if(self.villian.can('attack')){
            
            if(self.villian.can('diveBomb')){
              
              console.log("bug: then we are above krillin! crush him! (hidden finisher feature)");
              self.villian.sprite.position.y = self.krillin.sprite.position.y;
              self.villian.face(self.krillin);
              
            }else {
              // for now manually code this till i create a 'dragon homing' module
              console.log('Own Krillin!');
              self.villian.isFinisherMode = true;
              self.krillin.isFinisherMode = true;
              
              self.villian.face(self.krillin);
              self.krillin.face(self.villian);
              
              self.villian.sprite.play('kick');
              self.krillin.sprite.play('pain');
              
              self.villian.body.allowGravity = false;
              self.krillin.body.allowGravity = false;
              
              self.villian.body.velocity.setTo(0);
              self.krillin.body.velocity.setTo(0);
            }
          }
        }
        
        
        if(!self.villian.finisherStep && self.krillin.stats.hp < 0) {
          self.villian.finisherStep = 1;
          self.villian.sprite.play('knockback');
          
          self.krillin.sprite.body.collideWorldBounds = false;
          self.krillin.sprite.animations.currentAnim.stop();
          self.krillin.sprite.frameName = 'lsw_krillin_pain2';
          self.krillin.body.velocity.x = 500 * (self.krillin.sprite.position.x > self.villian.sprite.position.x ? 1 : -1);
          self.krillin.body.velocity.y = -10;
          
          self.updateMan.once(
            function(){return !self.krillin.between(0, 575)},
            function() {
                console.log("level complete!");
                self.krillin.body.velocity.setTo(0);
                self.game.add.sprite(0, 0, 'owned_count').scale.setTo(.365);
            }
          );

        }
      }
    });
    
    // debug: Frames per second counter
    this.game.time.advancedTiming = true;
  },
  render: function(){
    this.game.debug.text(game.time.fps, 280, 310, '#ffffff');
  },
  
  update: function() {
  
    // WARN: collisions should be checked FIRST in an update loop. If not, it can override gravity and cause other catastrophe
    // arcade.overlap is a trigger collision without energy transfer
    this.game.physics.arcade.collide(this.villian.sprite, this.platforms, null, null, null);
    
    this.game.physics.arcade.collide(this.platforms, this.krillin.sprite);
    
    this.game.physics.arcade.collide(this.villian.sprite, this.krillin.sprite);
    
    this.updateMan.update();
    
    // todo: change to slow update
    // todo: color yellow %50 and red %25
    this.textR.setText('%'+this.villian.percentOf('ki'));
    this.textK.setText('%'+this.krillin.percentOf('ki'));
  }
};

var game = new Phaser.Game(568, 320, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');