import { translations } from "../utils/localization.js";
import { dataGlobal } from "./globalData.js";



export function localPingPong()
{
    
  let app = document.getElementById("app");

  app.innerHTML = `

        <div class="signin" id="gameSet">
          <div class="form-container">
              <div class="form-header">
                  <h2 data-localize="players" >${translations[dataGlobal.selectedLanguage]['players']}</h2>
              </div>
                  <form id="signinForm">
                  <div class="form-group">
                      <input type="text" class="form-control" id="username" data-localize="player1name" placeholder="${translations[dataGlobal.selectedLanguage]['player1name']}" autocomplete="username">
                  </div>
                  <div class="form-group">
                      <input  type="text" class="form-control" id="password" data-localize="player2name" placeholder="${translations[dataGlobal.selectedLanguage]['player2name']}" autocomplete="username2">
                  </div>
                  <button id="signinBtn" type="submit" class="btn btn-primary btn-block">Start</button>
                  </form>
          </div>
        </div>
  `
  document.getElementById("signinBtn").addEventListener('click', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const username2 = document.getElementById('password').value;
    if (!username.length || !username2.length || username === username2)
      return;
    localPong(1, {game:"justTwo", vs1: username, vs2: username2})
})

}


export function localPong(isVsBot, objConf)
{
  
  let app = document.getElementById("app");

  app.innerHTML = `<div id="game-container">
    <div class="player-info">
        <div class="player">
            <p id="player1-name">${objConf.vs1}</p>
        </div>
        <div class="player">
            <p id="player2-name">${objConf.vs2}</p>
        </div>
    </div>
    <canvas id="pongCanvas" width="600" height="400"></canvas>
    <p id="hint" >W , S   |   <span>&#8593;</span> , <span>&#8595;</span></p>

</div>`;


    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700;// window.innerWidth;
    canvas.height = 350;//window.innerHeight;
    let flag = isVsBot;

    const keyPressed = [];
    const KEY_UP = 87;
    const KEY_DOWN = 83;
    
    const KEY_UP_RIGHT = 38;
    const KEY_DOWN_RIGHT  = 40;

    function handleKeyDownLocal(e)
    {
        console.log(e.keyCode);
        keyPressed[e.keyCode] = true;
    }
    function handleKeyUpLocal(e)
    {
        keyPressed[e.keyCode] = false;
    }
    window.addEventListener("keydown", handleKeyDownLocal);
    window.addEventListener("keyup", handleKeyUpLocal);

    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keydown', 'fun': handleKeyDownLocal });
    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keyup', 'fun': handleKeyUpLocal });

    function vec2(x, y)
    {
      return {x: x, y : y};
    }

    function Ball(pos , velocity, radius)
    {
      this.pos = pos;
      this.velocity = velocity;
      this.radius = radius;

      this.update = function ()
      {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
      };

      this.draw = function ()
      {
        ctx.fillStyle = "#FFF";
        ctx.beginPath ();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      };
    }

    function Paddle(pos , velocity, width, height, jj, username)
    {
      this.s = jj;
      this.pos = pos;
      this.velocity = velocity;
      this.width = width;
      this.height = height;
      this.score = 0;
      this.username = username;
      this.update = function (){
        if (this.s === 1)
        {
          if (keyPressed[KEY_UP])
          this.pos.y -= this.velocity.y;
          if (keyPressed[KEY_DOWN])
            this.pos.y += this.velocity.y;
        }
        else
        {
          if (keyPressed[KEY_UP_RIGHT])
            this.pos.y -= this.velocity.y;
          if (keyPressed[KEY_DOWN_RIGHT])
            this.pos.y += this.velocity.y;
        }

      }

      this.draw = function () {
        ctx.fillStyle  = "#FFF";
        ctx.fillRect (this.pos.x, this.pos.y, this.width, this.height);
      }

      
      this.getHalfWidth = function ()
      {
        return this.width / 2;
      };

      this.getHalfHeight = function ()  { return this.height / 2};


      this.getCenter = function (){
        return vec2(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight());
      }
    }


    function paddleCollisionWithEdges(paddle)
    {
      if (paddle.pos.y < 0)
        paddle.pos.y = 0;
      if (paddle.pos.y + paddle.height > canvas.height)
        paddle.pos.y = canvas.height - paddle.height;
    }
    

    function ballCollisionWithEdges(ball)
    {

      if (ball.pos.y - ball.radius <= 0 )
      {
        ball.velocity.y = Math.abs(ball.velocity.y);
      }
      else if (ball.pos.y + ball.radius >= canvas.height)
      {
        ball.velocity.y = -Math.abs(ball.velocity.y);
      }

    }


    function ballPaddleCollision(ball, paddle)
    {
      let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
      let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

      if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (paddle.getHalfHeight() + ball.radius)
                && ball.pos.y >= paddle.pos.y && ball.pos.y <= paddle.pos.y + paddle.height)
      {
        if (paddle.s === 1)
          ball.pos.x = (paddle.pos.x + paddle.width) + 3;//ball.radius;  // if ball gets stuck
        else
          ball.pos.x = paddle.pos.x - paddle.width - 3;//ball.radius; // if ball gets stuck
          
        let deltay = ball.pos.y - (paddle.pos.y + paddle.height/2);
        ball.velocity.y = deltay * 0.30;

        ball.velocity.x *= -1;



        let j = 1
        if ((ball.velocity.x < 0))
            j = -1

        ball.velocity.x = (Math.abs(ball.velocity.x) + 0.06) * j

      }

    }

    function player2ai (ball, paddle) {
      if (ball.velocity.x > 0)
      {
          if (ball.pos.y > paddle.pos.y)
          {
            paddle.pos.y += paddle.velocity.y;

            if (paddle.pos.y + paddle.height >= canvas.height)
              paddle.pos.y = canvas.height - paddle.height;
          }


          if (ball.pos.y < paddle.pos.y)
          {
            paddle.pos.y -= paddle.velocity.y;

            if (paddle.pos.y < 0)
              paddle.pos.y = 0;
          }
      }
    }

    function respawnBall(ball)
    {
      if (ball.velocity.x > 0)
      {
        ball.pos.x = canvas.width - 150;
        ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
      }
      else
      {
        ball.pos.x = 150;
        ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
      }
      ball.velocity.x *= -1;
      ball.velocity.y *= -1;

      let j = 1
      if ((ball.velocity['x'] < 0))
          j = -1
      ball.velocity.x = 13 * j

      clearInterval(dataGlobal.idInterval);
      dataGlobal.idInterval = -1;
      dataGlobal.idTimeOut =  setTimeout (()=>
        {
          dataGlobal.idInterval = setInterval(gameLoop, 20)
    
        }, 1000)

    }

    function increaseScore(ball, paddle_1, paddle_2)
    {
      if (ball.pos.x <= -ball.radius)
      {
        paddle_2.score += 1;
        respawnBall(ball)
      }
      if (ball.pos.x >= canvas.width + ball.radius)
      {
        paddle_1.score += 1;
        respawnBall(ball)
      }
    }

    function drawSceneGame()
    {
      ctx.strokeStyle = "#FFF";

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height );
      ctx.stroke();

    }
    
    const ball = new Ball (vec2(20,20), vec2(13, 13), 10);
    const paddle1 = new Paddle(vec2(0,70), vec2(10,10), 13, 90, 1, objConf.vs1);
    const paddle2 = new Paddle(vec2(canvas.width - 13, 100), vec2(10,10), 13, 90, 2, objConf.vs2);
    
    flag = isVsBot;

    function gameUpdate()
    {
      ball.update();
      paddle1.update();
      paddleCollisionWithEdges(paddle1);
      if (!flag)
        player2ai(ball, paddle2);
      else
       paddle2.update();
  
      paddleCollisionWithEdges(paddle2);

      ballCollisionWithEdges(ball);
    
      ballPaddleCollision(ball, paddle1);
      ballPaddleCollision(ball, paddle2);
      increaseScore(ball, paddle1, paddle2)
      drawText(paddle1.score, canvas.width / 4, 50, "#FFF"); // Draw team1 score
      drawText(paddle2.score, 3 * canvas.width / 4, 50, "#FFF"); 
    }

    function drawText(text, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    }

    function gameDraw()
    {
      ball.draw();
      paddle1.draw();
      paddle2.draw();
      drawSceneGame();
    }
    function gameLoop()
    {

      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fillRect(0,0,canvas.width, canvas.height);

        gameUpdate();
        gameDraw();
        if (paddle2.score >= 7 || paddle1.score >= 7)
        {
            let obj = objConf;
            clearInterval(dataGlobal.idInterval);
            dataGlobal.idInterval = -1;
            if (obj.game === "bot" || obj.game === "justTwo")
            {
              ctx.fillStyle = "rgba(0,0,0,1)"
              ctx.fillRect(0,0,canvas.width, canvas.height);
              if (paddle2.score >= 7 )
                drawText(paddle2.username, canvas.width / 2 - 20, canvas.height / 2 - 30, "#FFF"); 
              else
                drawText(paddle1.username, canvas.width / 2 - 20, canvas.height / 2 - 30, "#FFF"); 
              
              drawText(translations[dataGlobal.selectedLanguage]['istheWinner'], canvas.width / 2 - 30, canvas.height / 2, "#FFF");  
              return;
            }
        }
    
    }

    drawText(translations[dataGlobal.selectedLanguage]['ready'], canvas.width / 2 - 30, canvas.height / 2, "#FFF");  
    dataGlobal.idTimeOut = setTimeout (()=>
    {
      dataGlobal.idInterval = setInterval(gameLoop, 20)
    }, 2000)

}