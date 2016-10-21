// NEEDS a major refactor after i figure out all the functionality

function DualInput(context){
  
  this.cursors = context.input.keyboard.createCursorKeys();
  
  this.on = function(key, pressMode, func){
    
  }
  
  this.update = function(){
    
  }
  this.cursors.up.isDown
  
  this.listen = function(){
    //start the update listen
  }
  this.stop = function(){
    //halt the update
  }
  
  return this;
}

cheat = null;

var GameState = {

  init: function() {
    cheat = this;
    this.game.renderer.renderSession.roundPixels = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    //this.game.scale.startFullScreen();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 750;
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.world.setBounds(0, 0, 568, 320);
    
  },
  createOnSCreenControls: function(){
    
    this.rightArrow = this.add.button(85, 320, 'dragonball_arrow');
    this.leftArrow = this.add.button(85, 320, 'dragonball_arrow');
    this.action = this.add.button(425, 320, 'dragonball_dodge');
    this.own = this.add.button(425, 320, 'dragonball_own');
    
    this.rightArrow.anchor.setTo(0, 1);
    this.leftArrow.anchor.setTo(0, 1);
    this.action.anchor.setTo(0, 1);
    this.own.anchor.setTo(0, 1);
    
    this.rightArrow.alpha = 0.5;
    this.leftArrow.alpha = 0.5;
    this.action.alpha = 0.5;
    this.own.alpha = 0.5;
    
    this.leftArrow.scale.x = -.62;
    this.leftArrow.scale.y = .62;
    this.rightArrow.scale.setTo(.62);
    this.action.scale.setTo(.62);
    this.own.scale.setTo(.62);
    
    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.action.fixedToCamera = true;
    this.own.fixedToCamera = true;
    
    //phaser is a bit tricky with its inputs. the following should assist with a few of the common touch control glitches
    this.action.events.onInputDown.add(function(){
      this.mustJump = true;
    }, this);
    
    this.own.events.onInputDown.add(function(){
      this.timeToOwn = true;
    }, this);
    
    this.leftArrow.events.onInputDown.add(function(){
      this.mustLeft = true;
    }, this);
    this.leftArrow.events.onInputOut.add(function(){
      this.mustLeft = false;
    }, this);
    this.leftArrow.events.onInputUp.add(function(){
      this.mustLeft = false;
    }, this);
    
    this.rightArrow.events.onInputDown.add(function(){
      this.mustRight = true;
    }, this);
    this.rightArrow.events.onInputOut.add(function(){
      this.mustRight = false;
    }, this);
    this.rightArrow.events.onInputUp.add(function(){
      this.mustRight = false;
    }, this);    
    
    this.own.visible = false;
  },

  preload: function() {
    this.game.load.atlasJSONHash('dbz', 'assets/img/dbz.png', 'assets/data/dbz.json');
    this.game.load.image('dragonball_arrow', 'assets/img/dragonball_arrow.png');
    this.game.load.image('dragonball_dodge', 'assets/img/dragonball_dodge.png');
    this.game.load.image('dragonball_own', 'assets/img/dragonball_own.png');
    this.game.load.text('scene1', 'assets/data/scene1.json');
  },

  create: function() {
    
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
      this.platforms.create(p.x, p.y, 'dbz', p.spriteName);
    }, this);
    
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);
    this.platforms.setAll('scale.x', 10);
    this.platforms.setAll('scale.y', .1);
    this.platforms.setAll('alpha', 0);
    
    
    this.controllerBackground = this.game.add.sprite(0, 220, 'dbz', 'scene_close_up');
    this.controllerBackground.scale.y = 1.25;
    this.controllerBackground.scale.x = 4;
    
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
    
    
    this.krillin = this.game.add.sprite(325, 215, 'dbz', 'lsw_krillin_stand');
    this.krillin.anchor.setTo(.5, 1);
    this.krillin.scale.x = -1;
    
    this.villian = this.game.add.sprite(45, 215, 'dbz', 'lsw_raditz_stand');
    this.villian.sprite = this.villian;
    this.villian.anchor.setTo(.5, 1);
    
    this.villian.animations.add('stand', ['lsw_raditz_stand'], 1);
    this.villian.animations.add('dash', ['lsw_raditz_dash'], 1);
    this.villian.animations.add('fall', ['lsw_raditz_fall'], 1);
    this.villian.animations.add('kick', ['lsw_raditz_kick', 'lsw_raditz_kick2'], 9, true);
    
    this.villian.play('stand');
    
    this.game.physics.arcade.enable(this.villian);
    this.game.physics.arcade.enable(this.krillin);
    
    this.createOnSCreenControls();
    
    this.game.camera.follow(this.villian);
  },
  
  update: function(){
  
    var speed = 200;
    var jumpSpeed = 500;
    
    var villianSpeed = 0;
  
    // WARN: collisions should be checked first in an update loop. If not, it can override gravity
    // arcade.overlap is a trigger collision without energy transfer
    this.game.physics.arcade.collide(this.platforms, this.villian, function(p, chara){

    });
    this.game.physics.arcade.collide(this.platforms, this.krillin, function(p, chara){

    });
    this.game.physics.arcade.collide(this.villian, this.krillin, function(villian, krillin){
      villian.position.y -= 100;
      krillin.position.y -= 100;
      krillin.position.x = 10;
      krillin.body.velocity.setTo(0);
    });
    
    // action template
    if(W.distance(this.villian, this.krillin) < 45){
      this.action.visible = false;
      this.own.visible = true;
    }else{
      //other buttons
      this.action.visible = true;
      this.own.visible = false;
    }
      
    //movement + controls
    if((this.mustJump || this.cursors.up.isDown) && this.villian.body.touching.down){
      this.mustJump = false;
      // i actually want a specific snap effect due to dbz teleportation effects
      //this.villian.body.velocity.y = -jumpSpeed;
      
      var afterImage = this.game.add.sprite(this.villian.position.x, this.villian.position.y, 'dbz', 'lsw_dodge');
      afterImage.anchor.setTo(.5, 1);
      afterImage.scale.x = this.villian.scale.x;
      afterImage.animations.add('animate', ['lsw_raditz_blur', 'lsw_dodge', 'lsw_dodge2', 'lsw_dodge', 'lsw_dodge'], 22, false);
      afterImage.play('animate', false, false, true);
      
      this.villian.position.y -= 50;
    }else{
      
      if(this.mustLeft || this.cursors.left.isDown){
        this.villian.scale.x = -1;
        villianSpeed -= speed;
      }
      
      if(this.mustRight || this.cursors.right.isDown){
        this.villian.scale.x = 1;
        villianSpeed += speed;
      }
    }
    
    //animations
    if(this.villian){
      
      if(W.isMovingVertical(this.villian, 3)){
        this.villian.play('fall');
      }else if(this.villian.body.velocity.x != 0){
        this.villian.play('dash');
      }else if(this.villian.body.touching.down){
        this.villian.play('stand');
      }
    }
    
    this.villian.body.velocity.x = villianSpeed;
  }
};

var game = new Phaser.Game(568, 320, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');