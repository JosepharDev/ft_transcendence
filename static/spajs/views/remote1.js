import {dataGlobal} from "./globalData.js";
import { pushUrl } from "../utils/urlRoute.js";


export async function remoteGame1()
{
    let app = document.getElementById("app");
    app.innerHTML = `<div id="game-container">
    <div class="player-info">
    </div>
    <canvas id="pongCanvas" width="700" height="350"></canvas>
    <button id="leavebtn" type="submit" class="btn-search btn btn-primary btn-block" data-localize="search">Leave</button>

    </div>`;


    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/pongTest/'
        + '3'
        + '/'
        );
    const canvas = document.getElementById('pongCanvas');
    const leavebtn = document.getElementById('leavebtn');
    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 350;



    dataGlobal.socketDisconnect.push(chatSocket);

    let iamuser = 0;


    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        if (data.message.action === 'NA')
        {
            drawText("ALREADY IN LOBBY", canvas.width / 2 - 100, canvas.height / 2, "#FFF"); 
            console.log('ayoo');
        }
        else if (data.message.action == 'iam' )
        {
            iamuser = data.message.iam;
            drawText("WAITING...", canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
            
        }
        else if (data.message.action === 'finish')
        {          

            ctx.fillStyle = "rgba(0,0,34,1)"
            ctx.fillRect(0,0,canvas.width, canvas.height);
            drawText(data.message.winner, canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
            drawText("WON", canvas.width / 2 - 25, canvas.height / 2 - 30, "#FFF"); 
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
            drawText(data.message.paddle_1.score, canvas.width / 4, 50, "#FFF");
            drawText(data.message.paddle_2.score, 3 * canvas.width / 4, 50, "#FFF"); 

        }
        else if (data.message.action === 'users')
        {
            document.querySelector(".player-info").innerHTML =
            `<div class="player">
            <img src="${data.message.avatar1}" alt="Player 1">
            <p id="player1-name">${data.message.user1}</p>
            </div>
            <div class="player">
                <img src="${data.message.avatar2}" alt="Player 2">
                <p id="player2-name">${data.message.user2}</p>
            </div>
        `

            ctx.fillStyle = "rgba(0,0,0,1)"
            ctx.fillRect(0,0,canvas.width, canvas.height);
            drawText("READY", canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
        }
        else if (data.message.action === 'reconnect')
            {
                document.querySelector(".player-info").innerHTML =
                `<div class="player">
                <img src="${data.message.avatar1}" alt="Player 1">
                <p id="player1-name">${data.message.user1}</p>
                </div>
                <div class="player">
                    <img src="${data.message.avatar2}" alt="Player 2">
                    <p id="player2-name">${data.message.user2}</p>
                    </div>
            `
            }

    }


    function onKeyDownEvent(e)
    {
        if (e.keyCode != 38 && e.keyCode != 40)  
        return;

        let msg = {
            'action': 'P',
            'user' : iamuser,
            'code': e.keyCode,
        }
        if (chatSocket.readyState === WebSocket.OPEN)
            chatSocket.send(JSON.stringify(msg));
    }
    function onKeyUpEvent(e)
    {
        if (e.keyCode != 38 && e.keyCode != 40)  
        return;

        let msg = {
            'action': 'U',
            'user' : iamuser,
            'code': e.keyCode,
        }
        if (chatSocket.readyState === WebSocket.OPEN)
            chatSocket.send(JSON.stringify(msg));
    }


    window.addEventListener("keydown", onKeyDownEvent)
    window.addEventListener("keyup", onKeyUpEvent)

    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keydown', 'fun': onKeyDownEvent });
    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keyup', 'fun': onKeyUpEvent });
    

    function leaveEvent(e)
    {
        let msg = {
            'action': 'C',
        }
        if (chatSocket.readyState === WebSocket.OPEN)
            chatSocket.send(JSON.stringify(msg));
        pushUrl('/');
    }
    leavebtn.addEventListener('click', leaveEvent);


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
