//"Planets Game" by Matthew Hillmer
// It's like a screensaver that's also a game or something
// 12/12/19

// Note: If you want to adjust the quantity, speed, and scale of the planets, you can do so using the parameters below.  

var numPlanets = 100; //edit this to change number of planets
var speed = 0.02;  //edit this to change the speed
var pScale = 1.5;  //edit this to change the size of planets
var shipSpeed = 15;  //edit this to change the speed of the ship
var numCubes = 125;  //edit this to change the number of cubes
var cScale = 1.6;  //edit this to change the size of cubes



var loading = true;
var playing = false;
var lostTheGame = false;
var shipX = 0;
var score = 0;
var planets = [];
var cubes = [];
var aScale;

function preload() {
  loadingVid = createVideo('loadingVid.mp4');
  loadingVid.hide();
  forcefield = createVideo('forcefield.mp4');
  forcefield.hide();
  font = loadFont('digital.ttf');
}

function setup() {
  loading = true;
  //createCanvas(1920, 1080, WEBGL);
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0,0,0);
  loadingVid.elt.muted = true;
  loadingVid.loop()
  forcefield.elt.muted = true;
  forcefield.loop()
  
  aScale = width / 1920;
  shipSpeed = shipSpeed * aScale;
  pScale = pScale * aScale;
  cScale = cScale * aScale;
  
  for (var i = 0; i < numPlanets; i++) {
    planets[i] = new planet(speed,pScale);
  }
  for (i = 0; i< numCubes; i++) {
    cubes[i] = new cube(speed/1.5, cScale, [255,0,0]);
  }
  texture(loadingVid)
  
  textFont(font);
}

function draw() {
  if(windowWidth != width || windowHeight != height)
  {
    resizeCanvas(windowWidth, windowHeight);
  }
  background(0,0,0);
  
  if((loadingVid.time() < 2.5) && loading == true)
  {
    stroke(0);
    texture(loadingVid)
    rect(-640/2 * aScale, -130/2 * aScale, 640 * aScale, 130 * aScale);
  }
  else if(loading == true)
  {
    loadingVid.hide()
    loading = false;
  }
  
  if (keyIsDown(LEFT_ARROW) && !loading) {
    if(!lostTheGame){
      playing = true;
    }
    if(shipX > -width/2)
    {
      shipX -= shipSpeed;
    }
  } 
  else if (keyIsDown(RIGHT_ARROW) && !loading) {
    if(!lostTheGame){
      playing = true;
    }
    if(shipX < width/2)
    {
      shipX += shipSpeed;
    }
  }
  
  if(keyIsDown(82))
  {
    window.location.reload();
  }
  
  if(lostTheGame)
  {
    fill(255,0,0);
    textSize(width / 4);
    textAlign(CENTER, CENTER);
    text("CRASH!", 0, -height/4);
    textSize(width / 15);
    text("Final Score: " + str(score), 0, 0);
    textSize(width / 30);
    text("[Press R to try again]", 0, height/4);
  }
  else if(!playing && !loading)
  {
    fill(0,150,0);
    textSize(width / 40);
    textAlign(LEFT, TOP);
    text("[press <- or -> to play]", width/4, height/2 - (width / 40));
  }
  
  for(var i=0; i<planets.length; i++)
  {
    planets[i].update();
  }
  
  
  if(playing)
  {
    for(i=0; i<cubes.length; i++)
    {
      cubes[i].update();
    }
    
    score++;
    fill(0,150,0);
    textSize(width / 40);
    textAlign(LEFT, TOP);
    text("Score: " + str(score), width/3, -height/2);
    
    if(score < 300)
    {
      fill(50,150,0);
      textAlign(CENTER, CENTER);
      textSize(width / 15);
      text("[AVOID THE BOXES]", 0, 0);
    }
    
    
    translate(shipX, height/2.3, 0);
    fill(100,100,100);
    rotateX(-5);
    stroke(color(random(255),random(255),random(255)));
    strokeWeight(4);
    angleMode(DEGREES);
    //rotateX(3);
    cone(20 * aScale, 85 * aScale, 3, 16);
    translate(0, -80 * aScale, -15 * aScale);
    stroke(50,50,255);
    fill(20,20,20);
    if(lostTheGame == true)
    {
      fill(255,0,0);
      playing = false;
    }
    strokeWeight(2);
    //rotateY(360);
    rotateX(185);
    cone(40 * aScale, 80 * aScale, 5, 1);
  }
  
}




function planet(speed,scale)
{
  this.Dspeed = speed;
  this.z = random(-1900,-400);
  this.x = random(-width,width);
  this.rot = 0;
  this.y = -5.0;
  this.delay = random(0,500);
  this.size = random([5,5,10,10,30,30,60,100,300]) * scale;
  this.randomColor = color(random(255),random(255),random(255));
  
  this.update = function()
  {
    if(this.delay > 0)
    {
      this.delay--;
    }
    else
    {
      this.rot = this.rot + 0.01;
      this.y += this.Dspeed;
      //if(playing == false)
      if(true)
      {
        noFill();
        strokeWeight(1);
        stroke(this.randomColor);
        if(lostTheGame)
        {
          stroke(255,0,0);
        }
      }
      else
      {
        ////tint(150, 250);
        ////texture(forcefield);
        noFill();
        stroke([0,100,0]);
        ////noStroke();
      }
      push();
      translate(this.x, height * this.y, this.z);
      rotateY(this.rot);
      sphere(this.size);
      pop();
    
      if(this.rot>355)
      {
        this.rot=0;
      }
      
      if(this.y > 4)
      {
        this.y = -5.0;
        this.z = random(-1900,-400);
        this.x = random(-width,width);
        
        this.delay = random(0,100);
        this.size = random([5,5,10,10,30,30,60,100,300]) * scale;
      }
      
    }
  }   
}






function cube(speed,scale,cubeColor)
{
  this.Dspeed = speed;
  this.z = 0;
  this.x = random(-width,width);
  this.rot = 355;
  this.y = -5.0;
  this.delay = random(0,500);
  this.size = 50 * scale;
  this.weight = 4;
  
  this.update = function()
  {
    if(this.delay > 0)
    {
      this.delay--;
    }
    else
    {
      this.rot = this.rot - 0.00;
      this.y += this.Dspeed;
      //noFill();
      push();
      tint(150, 250);
      texture(forcefield);
      //fill([100, 0, 155]);
      stroke(cubeColor);
      strokeWeight(this.weight);
      translate(this.x, height * this.y, this.z);
      rotateY(this.rot);
      box(this.size);
      pop();
    
      if(this.rot<2)
      {
        this.rot=360;
      }
      
      if(this.y > 4)
      {
        this.y = -2.0;
        this.x = random(-width,width);
        
        this.delay = random(0,200);
        this.size = 50 * scale;
      }
      
      if(dist(shipX, (height / 2.3) - (80 * aScale), this.x, height * this.y) < this.size)
      {
        lostTheGame = true;
      }
      
    }
  }   
}
