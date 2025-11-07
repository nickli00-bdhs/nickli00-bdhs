const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gs = document.getElementById("buttonStart");

const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width/BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score = 0;      // 紀錄分數


//建立蛇蛇、蘋果物件    
snake = {
	//身體位置    
    body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],  
    //身體長度    
    size: 5, 
    //行進方向 
    direction: { x: 0, y: -1 }, 
    //畫蛇
    drawSnake: function () {
        this.moveSnake();
        ctx.fillStyle='lime';
        for (let i=0; i<this.body.length; i++){      
            ctx.fillRect(
                this.body[i].x * BLOCK_SIZE,
                this.body[i].y * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
            );
        }
    },
    //移動蛇
    moveSnake: function () {
        newBlock = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        }
        this.body.unshift(newBlock);
        while (this.body.length > this.size) {
            this.body.pop();
        }
    },
 }
 
apple = {
    //蘋果位置
    x: 5,
    y: 5,
    //畫蘋果
    drawApple: function () {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.x * BLOCK_SIZE ,
            this.y * BLOCK_SIZE ,
            BLOCK_SIZE ,
            BLOCK_SIZE
        );
    },
    //放蘋果
    putApple: function () {
        this.x = Math.floor(Math.random() * MAP_SIZE);
        this.y = Math.floor(Math.random() * MAP_SIZE);
    },
 }
function gameStart() {
    gameInterval = setInterval(drawGame, 100);
}
function keyDown(event) {
// up
if (event.keyCode == 38 || event.keyCode == 87) { // ↑ or W
    if (snake.direction.y == 1) return; // 如果原本在往下就不能往上
    snake.direction.y = -1;
    snake.direction.x = 0;
}
// down
else if (event.keyCode == 40 || event.keyCode == 83) { // ↓ or S
    if (snake.direction.y == -1) return; // 如果原本在往上就不能往下
    snake.direction.y = 1;
    snake.direction.x = 0;
}
// left
else if (event.keyCode == 37 || event.keyCode == 65) { // ← or A
    if (snake.direction.x == 1) return; // 如果原本在往右就不能往左
    snake.direction.x = -1;
    snake.direction.y = 0;
}
// right
else if (event.keyCode == 39 || event.keyCode == 68) { // → or D
    if (snake.direction.x == -1) return; // 如果原本在往左就不能往右
    snake.direction.x = 1;
    snake.direction.y = 0;
}
}
/////
function drawGame() {
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    eatApple(); 
    drawScore();
    checkDeath();    
}
function drawMap() {
    ctx.fillStyle = 'black' ;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function eatApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        apple.putApple();
    }
}
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);    
}
function checkDeath() {
    // hit walls
    if( (snake.body[0].x < 0) ||
        (snake.body[0].x >= MAP_SIZE)||
        (snake.body[0].y < 0) ||
        (snake.body[0].y >= MAP_SIZE)
    ){
        clearInterval(gameInterval);
    }
    // hit body
    for (var i=1; i<snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y) {
                clearInterval(gameInterval);
            }  
    }
}
function initgame() {
    // 停止上一場遊戲的計時器（如果有）
    if (typeof gameInterval !== "undefined") {
        clearInterval(gameInterval);
    }

    // 重設分數
    score = 0;

    // 重設蛇蛇
    snake.body = [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ];
    snake.size = 5;
    snake.direction = { x: 0, y: -1 }; // 初始往上

    // 重設蘋果位置
    apple.putApple();

    // 清空畫面
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    drawScore();
}

/////
document.addEventListener("keydown", keyDown);
gs.addEventListener("click", function(){
    initgame();
    gameStart(); //執行開始遊戲
});

