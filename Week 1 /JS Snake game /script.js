//defining HTML elements
const board = document.getElementById("game_board");
const instructions = document.getElementById("instructions");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScore = document.getElementById("high_score");

//defining variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = "right";
let gameSpeed = 200;
let gameInterval ;
let gameStarted=false;
let high_score = 0;

//draw snake , game , food
function draw()
{
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}


//start game
draw();


//draw snake
function drawSnake()
{
    snake.forEach((segment) => 
    {
        const snakeElement = createGameElement("div" , "snake");
        setPosition (snakeElement , segment);
        board.appendChild(snakeElement);
    });
}

//draw food
function drawFood()
{
    if(gameStarted == true)
    {
    const foodElement = createGameElement("div" , "food");
    setPosition(foodElement , food);
    board.appendChild(foodElement);
    }
}

//draw food and snake 
function createGameElement(tagName , className)
{
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

//set position of snake
function setPosition(element , position)
{
    element.style.gridRow = position.y;
    element.style.gridColumn = position.x;
}

//generate food
function generateFood()
{
    const x = Math.floor( Math.random()*gridSize ) + 1;
    const y = Math.floor( Math.random()*gridSize ) + 1;
    return {x , y};
}


//move snake
function moveSnake()
{
    const head = {...snake[0] };
    switch(direction)
    {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);

    //when snake eats food
    if (head.x === food.x && head.y === food.y)
    {
        food = generateFood();
        gameSpeed -= 15;
        clearInterval(gameInterval);
        gameInterval = setInterval(() => 
        {
            moveSnake();
            checkCollision();
            draw();
        }, gameSpeed);
    }
    else
    {
        snake.pop();
    }
}

//start game
function startGame()
{
    gameStarted=true;
    instructions.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => 
    {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeed);
}


//key press
function handleKeyPress(event)
{
    if((!gameStarted && event.code === "Space" )|| (!gameStarted && event.key === "" ) )
    {
        startGame();
    }
    else
    {
        switch(event.key)
        {
            case "ArrowUp":
                if (direction !== "down")
                {
                    direction = "up";
                }
                break;
            case "ArrowDown":
                if (direction !== "up")
                {
                    direction = "down";
                }
                break;
            case "ArrowLeft":
                if (direction !== "right")
                {
                    direction = "left";
                }
                break;
            case "ArrowRight":
                if (direction !== "left")
                {
                    direction = "right";
                }
                break;
        }
    
    }
}

document.addEventListener("keydown" , handleKeyPress);

//check collision
function checkCollision()
{
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize)
    {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++)
    {
        if (head.x === snake[i].x && head.y === snake[i].y)
        {
            resetGame();
        }
    }
}

//reset game
function resetGame()
{
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = "right";
    gameSpeed = 200;
    updateScore();
    
}

//update score
function updateScore()
{
    const current_score = snake.length - 1;
    score.textContent = current_score.toString().padStart(3 , "0");
}

//update high score
function updateHighScore()
{
    const current_score = snake.length - 1;
    if (current_score > high_score)
    {
        high_score = current_score;
        highScore.textContent = high_score.toString().padStart(3 , "0");
    }
    highScore.style.display = "block";
}

//stop game
function stopGame()
{
    clearInterval(gameInterval);
    instructions.style.display = "block";
    logo.style.display = "block";
    gameStarted=false;
}

