class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving=false
    this.leftKeyActive=false
    this.blast=false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();
    fuels=new Group()
    powerCoins=new Group()
    obstacles=new Group()
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2IMG },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1IMG },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1IMG },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2IMG },
      { x: width / 2, y: height - 2800, image: obstacle2IMG },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1IMG },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2IMG },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2IMG },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1IMG },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2IMG },
      { x: width / 2, y: height - 5300, image: obstacle1IMG },
      { x: width / 2 - 180, y: height - 5500, image: obstacle1IMG }
    ];
    this.addSprite(fuels,4,fuelIMG,0.02)
    this.addSprite(powerCoins,18,coinIMG,0.09)
    this.addSprite(obstacles,obstaclesPositions.length,obstacle1IMG,0.04,obstaclesPositions)

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car1.addImage("explosion",explosionIMG)

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    car2.addImage("explosion",explosionIMG)
    cars = [car1, car2];
  }
  obstacleCollision(index){
  if(cars[index-1].collide(obstacles)){
  if(this.leftKeyActive){
  player.positionX+=100
  }
  else{
  player.positionX-=100
  }
  if(player.life>0){
  player.life-=185/3;
  }
  player.update()
  }
  }
  carCollision(index){
  if(index===1){
  if(cars[index-1].collide(cars[1])){
  if(this.leftKeyActive){
 player.positionX+=100
  }
  else{
  player.positionX-=100
  }
  if(player.life>0){
    player.life-=185/3;
    }
    player.update()
  }
  }
  if(index===2){
    if(cars[index-1].collide(cars[0])){
    if(this.leftKeyActive){
   player.positionX+=100
    }
    else{
    player.positionX-=100
    }
    if(player.life>0){
      player.life-=185/3;
      }
      player.update()
    }
    }
  }
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();
    
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderboard();
      this.showfuel()
      this.showLife()
      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //adicione 1 ao índice para cada loop
        index = index + 1;

        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        
        var currentLife=allPlayers[plr].life
        if(currentLife<=0){
        cars[index-1].changeImage("explosion")
        cars[index-1].scale=0.3
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //colisoes
         this.obstacleCollision(index);
         this.carCollision(index)

          //alterar a posição da câmera na direção y
          camera.position.y = cars[index - 1].position.y;
          if(player.life<=0){
          this.blast=true
          this.playerMoving=false
          }
          this.handleFuel(index)
          this.handleCoins(index)
        }
      }
      if(this.playerMoving){
      player.positionY+=5
      player.update()
      }

      // manipulando eventos de teclado
      this.handlePlayerControls();

      drawSprites();
    }
  }

  handleResetButton() {
  this.resetButton.mousePressed(()=>{
  database.ref("/").set({
  carsAtEnd:0,
  playerCount:0,
  gameState:0,
  players:{}
  })
  window.location.reload()
  })
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(!this.blast){
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      this.playerMoving=true
      player.update();
    }
    if(keyIsDown(LEFT_ARROW)){
    player.positionX-=5
    this.leftKeyActive=true
    player.update()
    }
    if(keyIsDown(RIGHT_ARROW)){
    player.positionX+=5
    this.leftKeyActive=false
    player.update()
    }
  }
  }
  addSprite(spriteGroup,numberOfSprites,spriteImage,scale,positions=[]){
  for(var i=0;i<numberOfSprites;i++){
  var x,y
  if(positions.length>0){
  x=positions[i].x
  y=positions[i].y
  spriteImage=positions[i].image
  }else{
  x=random(width/2+150,width/2-150)
  y=random(-height*4.5,height-400)
  }
  var sprite=createSprite(x,y)
  sprite.addImage("sprite",spriteImage)
  sprite.scale=scale
  spriteGroup.add(sprite)
  }
  }
  showfuel(){
  push()
  image(fuelIMG,width/2-130,height-player.positionY-350,20,20)
  fill("white")
  rect(width/2-100,height-player.positionY-350,185,20)
  fill("#ffc400")
  rect(width/2-100,height-player.positionY-350,player.fuel,20)
  pop()
  }
  showLife(){
    push()
    image(lifeIMG,width/2-130,height-player.positionY-400,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-400,185,20)
    fill("#f50057")
    rect(width/2-100,height-player.positionY-400,player.life,20)
    pop()
    }
    handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
    player.fuel+=20;
    collected.remove();
    })
    if(player.fuel>0&&this.playerMoving){
    player.fuel-=0.2 
    }
    if(player.fuel<=0){
    gameState=2
    }
    }
    end(){
    console.log("game over")
    }
    handleCoins(index){
      cars[index-1].overlap(powerCoins,function(collector,collected){
      player.score+=20;
      player.update()
      collected.remove();
      })
    }
}
