Game.PhaserSummary = function () {
  this.score;
};

Game.PhaserSummary.prototype =
{
  preload: function ()
  {
    this.score = localStorage.getItem('score');
    game.load.image('button_return', 'SpaceFighter/assets/button_return.png', 200, 70);
  },

  create: function ()
  {
    var style = { font: "65px Arial", fill: "#fff", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY - 100, "Your result: \n" + this.score + "\n points!", style);

    var returnButton = game.make.button(game.world.centerX - 95, 400, 'button_return', this.returnActionOnClick, this);

    var buttonsGroup = game.add.group();
    buttonsGroup.add(returnButton);

    text.anchor.set(0.5);
  },
  update: function()
  {

  },
  render: function()
  {

  },

  returnActionOnClick: function ()
  {
    game.state.start('Menu');
  },
};