import {dataGlobal} from "./globalData.js";
import { pushUrl } from "../utils/urlRoute.js";
import { translations } from "../utils/localization.js";

export async function remoteTournament()
{
try
{
    let app = document.getElementById("app");
    app.innerHTML = `<div id="game-container">
    <div class="player-info">
    </div>
    <canvas id="pongCanvas" width="800" height="450"></canvas>
    <p id="scoreWin" data-localize="scoreWin">${translations[dataGlobal.selectedLanguage]['scoreWin']}</p>
    </div>    
        
        <div class="bracket-wrapper hideme">
        <div class="container">
            <div class="bracket-container">
                <!-- First Round -->
                <div class="round">
                    <div class="matchup us1">....</div>
                    <div class="connector">Vs</div>
                    <div class="matchup us2">....</div>
                </div>
                <div class="round">
                    <div class="matchup us3">....</div>
                    <div class="connector">Vs</div>
                    <div class="matchup us4">....</div>
                </div>
                <!-- Semi-Finals -->
                <div class="round">
                    <div class="horizontal-connector"></div>
                    <div class="matchup winner rone ">....</div>
                    <div class="connector">Vs</div>
                    <div class="matchup winner rtwo ">....</div>
                    <div class="horizontal-connector"></div>
                </div>
                <!-- Final -->
                <div class="round">
                    <div class="final-connector"></div>
                    <div class="matchup winner final-winner">....</div>
                    <div class="final-connector"></div>
                </div>
            </div>
        </div>
    </div>
    
    `;


    const canvas = document.getElementById('pongCanvas');
    const canvasContainer = document.getElementById('game-container');
    
    const tournamentBracket = document.querySelector('.bracket-wrapper');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 450;



    const chatSocket = new WebSocket(
        'wss://'
        + window.location.host
        + '/ws/tournament/'
        + '3'
        + '/'
        );

    dataGlobal.socketDisconnect.push(chatSocket);

    let iamuser = 0;


    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);

        if (data.message.action === 'NA')
        {
            let temp = translations[dataGlobal.selectedLanguage]['alreadyPlaying'];
            drawText(temp, canvas.width / 2 - 100, canvas.height / 2, "#FFF"); 

        }
        else if (data.message.action == 'iam' )
        {
            iamuser = data.message.iam;
            let temp = translations[dataGlobal.selectedLanguage]['waiting'];
            drawText(temp, canvas.width / 2 - 100, canvas.height / 2, "#FFF"); 
            
        }
        else if (data.message.action === 'finish')
        {          
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
            drawText(data.message.paddle_1.score, canvas.width / 4, 50, "#FFF");
            drawText(data.message.paddle_2.score, 3 * canvas.width / 4, 50, "#FFF"); 

        }
        else if (data.message.action === 'users')
        {
            // canvasContainer.classList.remove('hideme');
            canvasContainer.style.display = 'flex';
            tournamentBracket.classList.add('hideme');
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

            // `<h2 id="remoteUsers">${data.message.user1} vs ${data.message.user2}</h2>`;
            ctx.fillStyle = "rgba(0,0,0,1)"
            ctx.fillRect(0,0,canvas.width, canvas.height);
            const r = translations[dataGlobal.selectedLanguage]['ready'];
            drawText(r, canvas.width / 2 - 20, canvas.height / 2, "#FFF"); 
        }
        else if (data.message.action === 'allusers')
        {
            // canvasContainer.classList.add('hideme');
            canvasContainer.style.display = 'none';
            tournamentBracket.classList.remove('hideme');
            document.querySelector('.us1').textContent = data.message.user1;
            document.querySelector('.us2').textContent = data.message.user2;
            document.querySelector('.us3').textContent = data.message.user3;
            document.querySelector('.us4').textContent = data.message.user4;
        }
        else if (data.message.action === 'round1' || data.message.action === 'round2' || data.message.action === 'final')
        {
            // canvasContainer.classList.add('hideme');
            canvasContainer.style.display = 'none';
            tournamentBracket.classList.remove('hideme');


            document.querySelector('.us1').textContent = data.message.user1;
            document.querySelector('.us2').textContent = data.message.user2;
            document.querySelector('.us3').textContent = data.message.user3;
            document.querySelector('.us4').textContent = data.message.user4;
            document.querySelector('.rone').textContent = data.message.win1;
            document.querySelector('.rtwo').textContent = data.message.win2;

            if (data.message.action === 'round1')
            {
                document.querySelector('.rone').textContent = data.message.winner;
            }
            else if (data.message.action === 'round2')
            {
                // canvasContainer.classList.add('hideme');
                document.querySelector('.rtwo').textContent = data.message.winner;
            }
            else if (data.message.action === 'final')
            {
                document.querySelector('.final-winner').textContent = data.message.winner;
            }
        }
        else if (data.message.action === 'reconnect')
        {
            canvasContainer.style.display = 'none';
            tournamentBracket.classList.remove('hideme');
            document.querySelector('.us1').textContent = data.message.user1;
            document.querySelector('.us2').textContent = data.message.user2;
            document.querySelector('.us3').textContent = data.message.user3;
            document.querySelector('.us4').textContent = data.message.user4;
            document.querySelector('.rone').textContent = data.message.win1;
            document.querySelector('.rtwo').textContent = data.message.win2;

            if (data.message.isplaying)
            {
                canvasContainer.style.display = 'flex';
                tournamentBracket.classList.add('hideme');
                document.querySelector(".player-info").innerHTML =
                `<div class="player">
                <img src="${data.message.plr1Avatar}" alt="Player 1">
                <p id="player1-name">${data.message.plr1Username}</p>
                </div>
                <div class="player">
                    <img src="${data.message.plr2Avatar}" alt="Player 2">
                    <p id="player2-name">${data.message.plr2Username}</p>
                </div>
            `
            }
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
        chatSocket.send(JSON.stringify(msg));
    }

    window.addEventListener("keydown", onKeyDownEvent)
    window.addEventListener("keyup", onKeyUpEvent)

    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keydown', 'fun': onKeyDownEvent });
    dataGlobal.deleteEvent.push ({'elem' : window, 'evnt': 'keyup', 'fun': onKeyUpEvent });
    
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
catch(err)
{

}
}
