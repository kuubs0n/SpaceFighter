// tworzenie nowej gry o wymiarach x:800 px, y:600 px w elemencie o id phaser-example
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

// dodanie do gry stanow takich jak, menu, gra, lista wynikow, podsumowanie
game.state.add('Menu', Game.PhaserMenu, true);
game.state.add('Game', Game.PhaserGame, true);
game.state.add('HighScores', Game.PhaserHighScores, true);
game.state.add('Summary', Game.PhaserSummary, true);

// wywolanie stanu menu, ten ekran pojawia sie jako pierwszy uzytkownikowi
game.state.start('Menu');

if (localStorage.getItem('highScores') === null)
{
  var highScores = [0,0,0];
  localStorage.setItem("highScores", JSON.stringify(highScores));
}