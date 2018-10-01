Game.PhaserMenu = function ()
{
  this.buttonsGroup;

  this.logo;

  this.newGameButton;
  this.highScoresButton;
  this.soundButton;

  this.menuSoundtrack;
  this.loadingText;
};

Game.PhaserMenu.prototype =
{
  preload: function ()
  {
    game.load.image('logo','SpaceFighter/assets/logo.png');
    game.load.image('button_new_game', 'SpaceFighter/assets/button_new_game.png', 200, 70);
    game.load.image('button_high_scores', 'SpaceFighter/assets/button_high_scores.png', 200, 70);

    game.load.spritesheet('button_sound','SpaceFighter/assets/button_sound.png', 100, 100);

    game.load.audio('menu_soundtrack', 'SpaceFighter/mp3/menu.mp3');

    loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', { font: "25px Arial", fill: "#FFF" });
    loadingText.anchor.setTo(0.5, 0.5);
  },

  create: function ()
  {
    if (localStorage.getItem('sound') === null)
    {
      //localStorage.setItem("sound", true);
    }

    game.global = {
      sound : JSON.parse(localStorage.getItem('sound'))
    };

    loadingText.destroy();

    this.menuSoundtrack = game.add.audio('menu_soundtrack');

    this.newGameButton = game.make.button(game.world.centerX - 95, 400, 'button_new_game', this.newGameActionOnClick, this);
    this.highScoresButton = game.make.button(game.world.centerX - 95, 480, 'button_high_scores', this.highScoresActionOnClick, this);

    this.soundButton = game.make.button(game.world.centerX + 250, game.world.centerY + 150, 'button_sound', this.buttonSoundActionOnClick, this, 1 , 1,   1);

    if (game.global.sound)
    {
      // play sound because it's on
      this.soundButton.setFrames(1, 1, 1);
      this.menuSoundtrack.loopFull(0.5);
      this.menuSoundtrack.play();
    } else {
      // don't play sound because it's off
      this.soundButton.setFrames(0, 0, 0);
      this.menuSoundtrack.stop();
    }

    this.buttonsGroup = game.add.group();
    this.buttonsGroup.add(this.newGameButton);
    this.buttonsGroup.add(this.highScoresButton);
    this.buttonsGroup.add(this.soundButton);

    this.logo = game.add.sprite(game.world.centerX, game.world.centerY-100, 'logo');
    this.logo .anchor.setTo(0.5, 0.5);

    game.add.tween(this.logo).from( { y: -200 }, 2000, Phaser.Easing.Bounce.Out, true);

  },

  newGameActionOnClick: function ()
  {
    this.menuSoundtrack.stop();
    game.state.start('Game');
  },

  highScoresActionOnClick: function ()
  {
    this.menuSoundtrack.stop();
    game.state.start('HighScores');
  },

  buttonSoundActionOnClick: function ()
  {
    if (game.global.sound)
    {
      // turn off the sound
      this.soundButton.setFrames(0, 0, 0);
      game.global.sound = false;
      this.menuSoundtrack.stop();
      localStorage.setItem('sound', JSON.stringify(false));
    }
    else
    {
      // turn on the sound
      this.soundButton.setFrames(1, 1, 1);
      game.global.sound = true;
      this.menuSoundtrack.play();
      localStorage.setItem('sound', JSON.stringify(true));
    }
  }
};
