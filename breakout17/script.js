const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const brickRowCount = 9;
const brickColumnCount = 5;

let score = 0;



const ball = { // ball properties
  x: canvas.width / 2,
  y: canvas.height /2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
}
const paddle = { // paddle properties
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}
const brickInfo = { // brick properties
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}
const bricks = [];
for(let i=0; i<brickRowCount; i++){
  bricks[i] = [];
  for(let j=0; j<brickColumnCount; j++){
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo}
  }
}
function drawBall() { // draw ball function
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}
function drawPaddle(){ // draw paddle function
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}
function drawScore(){ // draw score function
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
function drawBricks(){ // draw bricks function
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  })
}
function movePaddle(){ // move paddle on canvas
  paddle.x += paddle.dx;

  // Wall detection (right side)
  if(paddle.x + paddle.w > canvas.width){
    paddle.x = canvas.width - paddle.w;
  }
  // Wall detection (left side)
  if(paddle.x < 0 ){ 
    paddle.x = 0;
  }
}
function moveBall(){
  ball.x += ball.dx;
  ball.y += ball.dy;
  // wall detection (left/right)
  if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
    ball.dx *= -1;
  }
  // wall detection (top/bottom)
  if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
    ball.dy *= -1;
  }
  // paddle detection
  if(
    ball.x - ball.size > paddle.x && 
    ball.x + ball.size < paddle.x + paddle.w && 
    ball.y + ball.size > paddle.y){
    ball.dy = -ball.speed;
  }
  // brick detection
  bricks.forEach(column => {
    column.forEach(brick => {
      if(brick.visible){
        if(
          ball.x - ball.size > brick.x && // brick left side check
          ball.x + ball.size < brick.x + brick.w && // brick right side check
          ball.y + ball.size > brick.y && // brick top check
          ball.y - ball.size < brick.y + brick.h // brick bottom check
        ){ // if all true...
          ball.dy *= -1; // bounce ball
          brick.visible = false; // remove from screen
          increaseScore();
        }
      }
    });
  });

  // You lose! (ball hit bottom)
  if(ball.y + ball.size > canvas.height){
    showAllBricks();
    score = 0;
  }
}

function increaseScore(){
  score++;
  if(score % (brickRowCount * brickColumnCount) === 0){
    showAllBricks();
  }
}
function showAllBricks(){
  bricks.forEach(column => {
    column.forEach(brick=> {
      brick.visible = true;
    })
  })
}


function draw(){ // draw ball and paddle
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}
// draw();
function update(){
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}
update();

function keyDown(e){
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === "d"){
    paddle.dx = paddle.speed;
  } else if(e.key === 'Left' || e.key === 'ArrowLeft' || e.key === "a"){
    paddle.dx = -paddle.speed;
  }
}
function keyUp(e){
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === "d"){
    paddle.dx = 0;
  } else if(e.key === 'Left' || e.key === 'ArrowLeft' || e.key === "a"){
    paddle.dx = 0;
  }
}


// Event listeners
rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});
closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});
// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);