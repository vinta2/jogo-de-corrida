var canvas;
var backgroundImage, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var fuels,powerCoins
var fuelIMG,coinIMG
var obstacles,obstacle1IMG,obstacle2IMG,explosionIMG
var life,lifeIMG

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track2.jpg");
  fuelIMG=loadImage("./assets/fuel.png")
  coinIMG=loadImage("./assets/goldCoin.png")
  obstacle1IMG=loadImage("./assets/obstacle1.png")
  obstacle2IMG=loadImage("./assets/obstacle2.png")
  lifeIMG=loadImage("./assets/life.png")
  explosionIMG=loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
  if(gameState===2){
  game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
