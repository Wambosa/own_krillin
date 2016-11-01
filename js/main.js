cheat = null;

var GameState = {

  init: function() {
    cheat = this;
    this.game.renderer.renderSession.roundPixels = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 750;
    this.game.world.setBounds(0, 0, 568, 320);
    
    this.dualInput = new DualInput(this.game);
    this.updateMan = new UpdateManager({context: this.game});
  },
  createOnSCreenControls: function(){
    
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
      x: 85,
      y: 320,
      scale: .6
    });
    this.dualInput.button({
      key: 'up',
      spriteName: 'dragonball_dodge',
      x: 398,
      y: 320,
      scale: .6
    });
    
    this.dualInput.button({
      key: 'own',
      spriteName: 'dragonball_own',
      x: 398,
      y: 320,
      scale: .6
    });
  },

  preload: function() {
    this.game.load.text('scene1', 'assets/data/scene1.json');
    this.game.load.atlasJSONHash('dbz', 'assets/img/dbz.png', 'assets/data/dbz.json');
    this.game.load.image('dragonball_arrow', 'assets/img/dragonball_arrow.png');
    this.game.load.image('dragonball_dodge', 'assets/img/dragonball_dodge.png');
    this.game.load.image('dragonball_own', 'assets/img/dragonball_own.png');
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
    

    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.sceneData.platforms.forEach(function(p){
      self.platforms.create(p.x, p.y, 'dbz', p.spriteName);
    });
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);
    this.platforms.setAll('scale.x', 10);
    this.platforms.setAll('scale.y', .1);
    this.platforms.setAll('alpha', 0);

    this.createOnSCreenControls();

    // todo: alter the sprite to have tranceparency
    this.vs = this.game.add.sprite(284, 240, 'vs');
    this.vs.anchor.setTo(.5, 0);
    this.vs.scale.setTo(.4);

    this.healthR = this.game.add.sprite(278, 253, 'bar');
    this.healthR.anchor.setTo(0, .5);
    this.healthR.scale.setTo(-2, .45);
    this.healthR.tint = 0x00ff00;
    
    this.healthK = this.game.add.sprite(289, 253, 'bar');
    this.healthK.anchor.setTo(0, .5);
    this.healthK.scale.setTo(2, .45);
    this.healthK.tint = 0x00ff00;
    
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
      name: "raditz" || this.sceneData.villian,
      hp: 5000,
      power: 1000,
      speed: 150,
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
      target: this.villian.sprite
    });
    
    this.dualInput.touch.up.condition = function() {
      return !self.dualInput.touch.own.visible;
    };
    this.dualInput.touch.own.condition = function() {
      return self.krillin.progress == self.villian.progress && W.distance(self.villian.sprite, self.krillin.sprite) < 35;
    };
    
    this.updateMan.add(this.villian);
    this.updateMan.add(this.krillin);
    this.updateMan.add(this.dualInput);
    
    // meh
    this.game.camera.follow(this.villian.sprite);
    this.game.time.advancedTiming = true;
  },
  render: function(){
    this.game.debug.text(game.time.fps, 280, 310, '#ffffff');
  },
  
  update: function(){
  
    // WARN: collisions should be checked FIRST in an update loop. If not, it can override gravity
    // arcade.overlap is a trigger collision without energy transfer
    this.game.physics.arcade.collide(this.platforms, this.villian.sprite, function(p, chara){

    });
    this.game.physics.arcade.collide(this.platforms, this.krillin.sprite, function(p, chara){

    });
    this.game.physics.arcade.collide(this.villian.sprite, this.krillin.sprite, function(villian, krillin){
      //stop him from rolling off the screen
      krillin.body.velocity.setTo(0);
    });
    
    
    
    this.updateMan.update();
    
      
    //movement + controls
    var villianSpeed = 0;
    
    if(this.dualInput.if('up') && this.villian.body.touching.down){
      
      this.villian.dodge({y: -50});
      
    }else{
      
      if(this.dualInput.if('left')){
        //this.villian.sprite.scale.x = -1;
        villianSpeed -= this.villian.stats.speed;
      }
      
      if(this.dualInput.if('right')){
        //this.villian.sprite.scale.x = 1;
        villianSpeed += this.villian.stats.speed;
      }
    }

    this.villian.body.velocity.x = villianSpeed;


    //krillin AI
    
    var krillinSpeed = 0;
    
    if(this.sceneData.krillinMoves.indexOf('run') > -1){
      
      // move away from the villian, at least n distance. 
      // when the villian closes on the resting location for the layer, then afterImage up to the next layer and run away
      
      // isBetween method
      if(W.spriteDistance(this.villian, this.krillin) < 175 && (this.krillin.sprite.position.x < 550 && this.krillin.sprite.position.x > 50)){
        
        krillinSpeed = this.krillin.sprite.position.x > this.villian.sprite.position.x ? 145 : -145;
        
      }
      
      if(this.krillin.sprite.position.x >= 550 && !this.krillin.progress && W.spriteDistance(this.villian, this.krillin) < 45){
        
        this.krillin.progress = 1;
        this.krillin.dodge({x: -60, y: -100});
      }
      
      if(this.krillin.progress === 1){
        
      }
      
    }
    
    this.krillin.body.velocity.x = krillinSpeed;
  }
};

var game = new Phaser.Game(568, 320, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');