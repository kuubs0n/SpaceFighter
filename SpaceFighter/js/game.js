Game.PhaserGame = function () {

  this.starfield;
  this.bounds;
  this.player;
  this.isPlayerAlive = true;

  // hud
  this.scoreText;
  this.score = 0;
  this.lives = [];

  //hearts
  this.heartSprite1;
  this.heartSprite2;
  this.heartSprite3;
  this.livesCounter = 3;

  // controls
  this.cursors;
  this.fireButton;

  // strzelanie
  this.weapons = ["laser", "canon"];
  this.weapon;
  this.bomb;
  this.bombs;

  // soundtrack
  this.soundtrack;
  this.weaponSound;
  this.availableExplosions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  this.aliens;
  this.aliensTween;
  this.availableMonsters = ["1", "2", "3"];
  this.explosions;
  this.MAX_MONSTERS = 5;

  this.timer;
  this.timerExtraLive;
  this.timerExtraMoney;
};

Game.PhaserGame.prototype =
{
  preload: function ()
  {
      game.load.image('background','SpaceFighter/assets/background.png');
      game.load.image('spaceShuttle','SpaceFighter/assets/space_shuttle.png');
      game.load.image('scoreboard', 'SpaceFighter/assets/virtualjoystick/space1.png')
      game.load.image('bullet', 'SpaceFighter/assets/bullet.png');
      game.load.image('heart', 'SpaceFighter/assets/heart.png');
      game.load.image('dollars', 'SpaceFighter/assets/dollars.png');

      //game.load.spritesheet('detonation', 'SpaceFighter/assets/explode.png', 128, 128);

      game.load.audio('soundtrack', 'SpaceFighter/mp3/soundtrack.mp3');
      game.load.audio('laser-1', 'SpaceFighter/mp3/weapons/laser/laser-1.mp3');
      game.load.audio('laser-2', 'SpaceFighter/mp3/weapons/laser/laser-2.mp3');
      game.load.audio('laser-3', 'SpaceFighter/mp3/weapons/laser/laser-3.mp3');
      game.load.audio('canon-1', 'SpaceFighter/mp3/weapons/canon/canon.mp3');

      game.load.image('bomb', 'SpaceFighter/assets/bomb.png');

      this.preloadMonsters();
      this.preloadExplosionSounds();

      var text = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', { font: "25px Arial", fill: "#FFF" });
      text.anchor.setTo(0.5, 0.5);


  },

  preloadMonsters: function ()
  {
    for (var i = 1; i <= this.availableMonsters.length; i++)
    {
      game.load.spritesheet('invader_' + i, 'SpaceFighter/assets/monsters/' + i +'.png', 100, 100);
    }
  },

  preloadExplosionSounds: function ()
  {
    for (var i = 1; i <= this.availableExplosions.length; i++)
    {
      game.load.audio('explosion-' + i, 'SpaceFighter/mp3/explosion/explosion-' + i +'.mp3');
    }
  },

  create: function ()
  {
    if (game.global.sound)
    {
      this.soundtrack = game.add.audio('soundtrack');
      this.soundtrack.play();
      this.soundtrack.loopFull(0.5);
      this.soundtrack.volume = 0.5;

      this.weaponSound = game.add.audio('canon-1');
    }

    // domyslne wartosci
    this.isPlayerAlive = true;
    this.livesCounter = 3;
    this.score = 0;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    this.bounds = game.add.tileSprite(0, 0, 800, 75, 'scoreboard');
    this.starfield = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.world.bringToTop(this.bounds);

    this.bounds = new Phaser.Rectangle(0, 0, game.world.width, 75);

    //  Create a graphic so you can see the bounds
    var graphics = game.add.graphics(this.bounds.x, this.bounds.y);
    // graphics.beginFill(0x000000);
    // graphics.drawRect(0, 0, this.bounds.width, this.bounds.height);
    // graphics.alpha = 0.2;

    this.player = game.add.sprite(100, 300, 'spaceShuttle');
    this.player.anchor.setTo(0.5, 0.5);

    //game.world.bounds = this.bounds;
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;
    this.player.rotation = 6.25;

    //  And some controls to play the game with
    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.scoreText = game.add.text(
      this.bounds.centerX -370,
      this.bounds.centerY - 15,
      "Score: " + 0,
      {
          font: "25px Arial",
          fill: "#FFFFFF",
          align: "center"
      }
    );
    this.scoreText.anchor.setTo(0, 0);


    this.lives.push(); this.lives.push(); this.lives.push();
    this.lives.push();
    this.lives.push(); this.lives.push(); this.lives.push();

    this.lives[0] = game.add.sprite(this.bounds.centerX + 300, this.bounds.centerY - 25, 'heart');
    this.lives[1] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[0], Phaser.LEFT_CENTER, 5);
    this.lives[2] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[1], Phaser.LEFT_CENTER, 5);
    this.lives[3] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[2], Phaser.LEFT_CENTER, 5);
    this.lives[4] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[3], Phaser.LEFT_CENTER, 5);
    this.lives[5] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[4], Phaser.LEFT_CENTER, 5);
    this.lives[6] = game.add.sprite(0, 0, 'heart').alignTo(this.lives[4], Phaser.LEFT_CENTER, 5);
    this.lives[3].visible = false;
    this.lives[4].visible = false;
    this.lives[5].visible = false;
    this.lives[6].visible = false;

    //  The baddies!
    this.aliens = game.add.group();
    this.aliens.enableBody = true;
    this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

    // The extra bomb!
    this.bombs = game.add.group();
    this.bombs.enableBody = true;
    this.bombs.physicsBodyType = Phaser.Physics.ARCADE;
    this.timer = game.time.create(false);
    this.timer.loop(5000, this.createBomb, this);
    this.timer.start();

    this.extraLives = game.add.group();
    this.extraLives.enableBody = true;
    this.extraLives.physicsBodyType = Phaser.Physics.ARCADE;
    this.timerExtraLive = game.time.create(false);
    this.timerExtraLive.loop(10000, this.createExtraLive, this);
    this.timerExtraLive.start();

    this.extraMoneys = game.add.group();
    this.extraMoneys.enableBody = true;
    this.extraMoneys.physicsBodyType = Phaser.Physics.ARCADE;
    this.timerExtraMoneys = game.time.create(false);
    var timeee = (Math.random() * (15000 - 6000) + 6000);
    this.timerExtraMoneys.loop(timeee, this.createExtraMoneys, this);
    this.timerExtraMoneys.start();

    this.weapon = game.add.weapon(15, 'bullet');
    //  The bullet will be automatically killed when it leaves the world bounds
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //  Because our bullet is drawn facing up, we need to offset its rotation:
    this.weapon.bulletAngleOffset = 0;
    //  Add a variance to the bullet speed by +- this value
    this.weapon.bulletSpeedVariance = 50;
    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 800;
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    this.weapon.fireRate = 180;
    //  Add a variance to the bullet angle by +- this value
    this.weapon.bulletAngleVariance = 3;
    //  Tell the Weapon to track the 'player' Sprite
    this.weapon.trackSprite(this.player, 35, 0, true);
    this.weapon.bulletAngle = 0;

  },

  update: function ()
  {
      //  Scroll the background
      this.starfield.tilePosition.x -= 2;

      //  Reset the player, then check for movement keys
      this.player.body.velocity.setTo(0, 0);

      if(this.cursors.left.isDown && this.cursors.up.isDown)
      {
          this.player.body.velocity.x = -200;

          this.player.body.velocity.y = -200;
      }

      if(this.cursors.left.isDown && this.cursors.down.isDown)
      {
          this.player.body.velocity.x = -200;
          this.player.body.velocity.y = 200;
      }

      if(this.cursors.right.isDown && this.cursors.up.isDown)
      {
          this.player.body.velocity.x = 200;

          this.player.body.velocity.y = -200;
      }

      if(this.cursors.right.isDown && this.cursors.down.isDown)
      {
          this.player.body.velocity.x = 200;
          this.player.body.velocity.y = 200;
      }

      if (this.cursors.left.isDown)
      {
          this.player.body.velocity.x = -400;

      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.velocity.x = 400;
      }
      else if (this.cursors.down.isDown)
      {
          this.player.body.velocity.y = 400;
      }
      else if (this.cursors.up.isDown)
      {
          this.player.body.velocity.y = -400;
      }

      //  Firing?
      if (this.fireButton.isDown)
      {
          this.weapon.fire();
      }

      if (this.aliens.countLiving() <= this.MAX_MONSTERS)
      {
        // losowanie "typu" potwora
        var monsterId = Math.floor((Math.random() * this.availableMonsters.length) + 1);
        var alien = this.aliens.create(900, game.rnd.integerInRange(0, 800), 'invader_' + monsterId);
        // ustawienie wielkosci potwora, losowo
        var scale = (Math.random() * (0.6 - 0.4) + 0.4).toFixed(4);
        alien.scale.setTo(scale, scale);
        // ustawienie punktu zaczepienia na srodku
        alien.anchor.setTo(0.5, 0.5);
        // ustawienie ilosci punktow za zabicie tego potwora
        alien.points = scale * 100;
        // nadanie potworom ruchu w osiach X i Y, losowo
        alien.body.velocity.x = game.rnd.integerInRange(-500, -50);
    		alien.body.velocity.y = game.rnd.integerInRange(-500, -50);
        alien.body.bounce.set(0.8);
        // wlaczenie kolizji z granicami rozgrywki
        alien.body.collideWorldBounds = true;
        // animacja potworów na podstawie wczesniej przygotowanych klatek
        alien.animations.add('fly', [ 0, 1, 3, 2 ], 8, true);
        alien.play('fly');
      }


      game.physics.arcade.collide(this.aliens);
      game.physics.arcade.overlap(this.weapon.bullets, this.aliens, this.bulletCollisionHandler, null, this);
      game.physics.arcade.overlap(this.aliens, this.player, this.enemyCollisionHandler, null, this);
      game.physics.arcade.overlap(this.bombs, this.player, this.bombCollisionHandler, null, this);
      game.physics.arcade.overlap(this.extraLives, this.player, this.extraLiveCollisionHandler, null, this);
      game.physics.arcade.overlap(this.extraMoneys, this.player, this.extraMoneysCollisionHandler, null, this);
  },

  bulletCollisionHandler: function (bullet, alien) {
    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();
    if (game.global.sound)
    {
      this.playRandomExplosionSound();
    }
    // var explosion = this.explosions.getFirstExists(false);
    // explosion.reset(alien.body.x, alien.body.y);
    // explosion.play('detonation', 30, false, true);
    this.score += Math.round(alien.points);
    this.scoreText.setText("Score: " + this.score);
  },

  playRandomExplosionSound : function()
  {
    var explosionId = Math.floor((Math.random() * this.availableExplosions.length) + 1);

    var explosionSound = game.add.audio('explosion-' + explosionId);
    explosionSound.play();
  },

  enemyCollisionHandler: function(player, alien)
  {
    //  When a bullet hits an alien we kill them both
    alien.kill();

    if (game.global.sound)
    {
      this.playRandomExplosionSound();
    }

    if (this.livesCounter > 1)
    {
      this.lives[this.livesCounter - 1].visible = false;
	    this.livesCounter--;
    }

    else
    {
      player.kill();
      this.isPlayerAlive = false;

      game.time.events.add(100, this.redirectToSummary, this);

    }
  },

  bombCollisionHandler: function(player, bomb)
  {
      bomb.kill();

      this.aliens.forEachExists(alien => alien.kill());

      this.score += 200;
      this.scoreText.setText("Score: " + this.score);
      this.timer.resume();
  },

  extraLiveCollisionHandler: function(player, extraLive)
  {
      extraLive.kill();
      this.livesCounter++;
      this.lives[this.livesCounter - 1].visible = true;

      this.timerExtraLive.resume();
  },

  extraMoneysCollisionHandler: function(player, extraMoney)
  {
      extraMoney.kill();
      this.score += Math.round(Math.random() * (5000 - 1000) + 1000);
      this.scoreText.setText("Score: " + this.score);
  },

  redirectToSummary: function ()
  {
    game.add.tween(this.starfield).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(this.aliens).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    game.add.tween(this.bounds).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);

    if (game.global.sound)
    {
      this.soundtrack.stop();
    }

    // pobierz wartosc z local storage o kluczu highScores
    var highScores = JSON.parse(localStorage.getItem("highScores"));

    // dodaj aktualny wynik do tablicy highScores
    highScores.push(this.score);
    // posortuj tablice rosnaco
    highScores.sort(function(a, b) { return a-b });
    // usun pierwszy element
    highScores.shift();

    // zapisz tablice z 3 najlepszymi wynikami w local storage o kluczu highScores
    localStorage.setItem("highScores", JSON.stringify(highScores));

    localStorage.setItem('score', this.score);

    game.state.start('Summary');
  },

  createBomb: function()
  {
      if(this.bombs.countLiving() < 1)
      {
        var bomb = this.bombs.create(game.rnd.integerInRange(game.world.centerX, game.world._height), game.rnd.integerInRange(0, game.world._height), 'bomb');
        bomb.anchor.setTo(0.5, 0.5);
        bomb.scale.setTo(0.3, 0.3);
        bomb.collideWorldBounds = true;
        this.timer.pause();
      }
  },

  createExtraLive: function()
  {
      if(this.extraLives.countLiving() < 1 && this.livesCounter <= 6)
      {
        var extraLive = this.extraLives.create(game.rnd.integerInRange(game.world.centerX, game.world._width), game.rnd.integerInRange(0, game.world._height), 'heart');
        extraLive.anchor.setTo(0.5, 0.5);
        extraLive.scale.setTo(0.3, 0.3);
        extraLive.collideWorldBounds = true;
        this.timerExtraLive.pause();
      }
  },
  createExtraMoneys: function()
  {
      var extraMoney = this.extraMoneys.create(game.rnd.integerInRange(game.world.centerX, game.world._width), game.rnd.integerInRange(0, game.world._height), 'dollars');
      extraMoney.anchor.setTo(0.5, 0.5);
      extraMoney.scale.setTo(0.3, 0.3);
      extraMoney.collideWorldBounds = true;
  }
};
