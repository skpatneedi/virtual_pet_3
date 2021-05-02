var dog, happyDog, database, foodS, foodStock , position;
var backgroundImg, dogImg;
var feedPet, addFood;
var fedTime, lastFed;
var foodObj;
var bedRoom, garden, livingRoom, washRoom;
var gameState,readGamestate;
var sadImage
var currentTime;
function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedRoom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  livingRoom = loadImage("images/Living Room.png");
  washRoom = loadImage("images/Wash Room.png");
  sadImage = loadImage("images/deadDog.png")
}


function setup(){
    createCanvas(500,500);
    database = firebase.database();
    dog = createSprite(250,400,50,50);
    dog.addImage("dog",dogImg);
    dog.addImage("dog",sadImage);
    dog.scale=0.25  ;
    
    foodStock =  database.ref('Food');
    foodStock.on("value",readStock)

    fedTime = database.ref('fedTime');
    fedTime.on("value",function(data){
      lastFed = data.val();
    })

    readGamestate = database.ref('gameState');
    readGamestate.on("value",function(data){
      gameState = data.val();
    })

    feedPet = createButton("Feed the Dog")
    feedPet.position(700,95);
    feedPet.mousePressed(feedDog)

    addFood = createButton("Add the food")
    addFood.position(400,95);
    addFood.mousePressed(addFoods)
      
    foodObj = new Food()
  }

function draw(){
    background("green");
    foodObj.display();
    drawSprites();
  
    textSize(25);
    fill("black");
    text("food remaining:"+ foodS,150,100);
    text("press space to feed the dog!" ,100 , 130 )
     if (gameState != "Hungry" ){
       feedPet.hide();
       addFood.hide();
       //dog.remove();
     }else{
       feedPet.show();
       addFood.show();
       dog.changeImage("dog");
     }
    
     currentTime = hour();
     if (currentTime == (lastFed + 1 )){
       update("Playing")
       foodObj.garden1();
     }else if(currentTime == (lastFed + 2)){
       update("Sleeping");
       foodObj.bedroom();
     }else if(currentTime>(lastFed + 2) && currentTime<=(lastFed + 4)){
      update("Bathing");
      foodObj.washroom();
     }else{
       update("Hungry")
       foodObj.display();
     }
     
     
     fill(255,255,254);
    textSize(15);
    if(lastFed>=12){
      text("Last fed :" + lastFed % 12 + "PM",350,30)
    }else if(lastFed == 0){
      text("Last fed : 12 AM",350,30);
    }else{
      text("Last fed :" + lastFed + "AM",350,30)
    }
}

function WriteStock(x){
    if(x<=0){
        x=0
    }
    else{
        x=x-1;

    }
    database.ref('/').update({
        Food:x
    })
}
function readStock(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS)
    
}

function feedDog(){
  dog.addImage(happyDog)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    fedTime:hour()
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}