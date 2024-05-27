import {dataGlobal} from "./globalData.js";
import { pushUrl } from "../utils/urlRoute.js";


export async function remoteGame1()
{
    let app = document.getElementById("app");
    app.innerHTML = '\
    <div id="game-container">\
    <div id="game-info">\
    </div>\
    <canvas id="pongCanvas" width="800" height="450"></canvas>\
    </div>';

    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 450;



    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/pongTest/'
        + '3'
        + '/'
        );

    dataGlobal.socketDisconnect.push(chatSocket);

    let iamuser = 0;
    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        // if (data.message.action == 'ALREADY' )
        // {
        //     // redirect to home;
        // } 
        if (data.message.action == 'iam' )
        {
            iamuser = data.message.iam;
            drawText("WAITING...", canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
            
        }
        else if (data.message.action === 'finish')
        {          
            alert (`${data.message.winner} WON`);
            pushUrl('/');
        }
        else if (data.message.action === 'data')
        {
            remoteGameLoop();
            drawBall(data.message.ball.pos.x, data.message.ball.pos.y, data.message.ball.radius);
            drawPaddle(
                data.message.paddle_1.pos.x,
                data.message.paddle_1.pos.y,
                data.message.paddle_1.width,
                data.message.paddle_1.height
            );
            drawPaddle(
                data.message.paddle_2.pos.x,
                data.message.paddle_2.pos.y,
                data.message.paddle_2.width,
                data.message.paddle_2.height
            );
            drawSceneGame();
            drawText(data.message.paddle_1.score, canvas.width / 4, 50, "#FFF"); // Draw team1 score
            drawText(data.message.paddle_2.score, 3 * canvas.width / 4, 50, "#FFF"); 
            // remoteIncreaseScore(data.message.paddle_1.s, data.message.paddle_1.score);
            // remoteIncreaseScore(data.message.paddle_2.s, data.message.paddle_2.score);
        }
        else if (data.message.action === 'users')
        {
            document.getElementById("game-info").innerHTML =
            `<h2 id="remoteUsers">${data.message.user1} vs ${data.message.user2}</h2>`;
            ctx.fillStyle = "rgba(0,0,0,1)"
            ctx.fillRect(0,0,canvas.width, canvas.height);
            drawText("READY", canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
        }

    }


    function onKeyDownEvent(e)
    {
        if (e.keyCode != 38 && e.keyCode != 40)  
        return;

        let msg = {
            'action': 'press',
            'user' : iamuser,
            'code': e.keyCode,
        }
        chatSocket.send(JSON.stringify(msg));
    }
    window.addEventListener("keydown", onKeyDownEvent)

    
    function drawText(text, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(text, x, y);
    }
    
    
    function drawBall(x, y, radius)
    {
      ctx.fillStyle = "#FFF";
      ctx.beginPath ();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    function remoteGameLoop()
    {
      ctx.fillStyle = "rgba(0,0,0,1)"
      ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    
    
    function drawPaddle(x, y, width, height)
    {
      ctx.fillStyle  = "#FFF";
      ctx.beginPath();
    
      ctx.fillRect(x, y, width, height);
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
}
