// define variable for ball count paragraph

const para = document.querySelector('p');
let count = 0;

// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define shape constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// define  Ball constructor inheriting Shape properties
function Ball(x, y, velX, velY, exists, color, size){//19/20
  Shape.call(this, x, y, velX, velY, exists);
  //this.exists = true;
  this.color = color;
  this.size = size;//7
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size && balls[j].exists) {//16
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// define EvilCircle's constructor

function EvilCircle(x, y, exists) { //17
  Shape.call(this, x, y, 20, 20, exists);//Blunder mistake shape -> Shape

  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

//** define EvilCircle's draw method

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};//3

//** define EvilCircle checkBounds method

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;//8
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;//9//12
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;//10
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;//11//13
  }
};

//** define EvilCircle setControls for moving the EvilCircle

EvilCircle.prototype.setControls = function() {
  let _this = this;
window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  };//1
};//2

//** define EvilCircle's collision detection

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(balls[j].exists) {//23
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
          balls[j].exists = false; //21//22
          count--;
          para.textContent = 'Ball count: ' + count;
      }
    }
  }
};

// define array to store balls and populate it

const balls = [];

while (balls.length < 25) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  //** updating counter
  count++;
  para.textContent = 'Ball count: ' + count;
}

//** define loop that keeps drawing the scene constantly

let evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();
// define loop that keeps drawing the scene constantly
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0; i < balls.length; i++) {
   if(balls[i].exists){ //18
    balls[i].draw();
    balls[i].update();//15
    balls[i].collisionDetect();
  }
}
  //** Drawing EvilCircle on the canvas
  evil.draw();
  evil.checkBounds();//6
  evil.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
