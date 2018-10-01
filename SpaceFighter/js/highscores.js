Game.PhaserHighScores = function () {

};

Game.PhaserHighScores.prototype =
{
  preload: function ()
  {
    this.score = localStorage.getItem('score');
    game.load.image('button_return', 'SpaceFighter/assets/button_return.png', 200, 70);
  },

  create: function ()
  {
    var style = { font: "65px Arial", fill: "#fff", align: "center" };
    var highScoreText = game.add.text(game.world.centerX, game.world.centerY - 200, "HIGH SCORES", style);
    highScoreText.anchor.set(0.5);

    var highScores = JSON.parse(localStorage.getItem("highScores"));
    var i = 3;
    highScores.forEach(function(element, id) {
        var result = game.add.text(game.world.centerX, game.world.centerY + 50 + (id * -100), (i--) + ". "+ element, style);
        result.anchor.x = 0.5;
    });

    var returnButton = game.make.button(game.world.centerX - 95, 450, 'button_return', this.returnActionOnClick, this);

    var buttonsGroup = game.add.group();
    buttonsGroup.add(returnButton);

  },

  returnActionOnClick: function ()
  {
    game.state.start('Menu');
  },
};