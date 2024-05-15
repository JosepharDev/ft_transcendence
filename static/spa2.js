
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


let deleteEvent = [];
let socketDisconnect = [];

let canvas = null ;
let ctx  = null;
let id = -1;


const urlLocationHandler = async () => {

    if (id != -1)
    {
        clearInterval(id);
        id = -1;
    }

    const location = window.location.pathname;
    if (!location.length)
        location = "/";

    const params = location.split('/');

    const request = {
      resource: params[1] || null,
      id: params[2] || null,
    };

    const parsedUrl =  (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '')

    console.log(params);

    deleteEvent.forEach(element => {
        element.elem.removeEventListener(element.evnt, element.fun);
    });
    deleteEvent = [];

    socketDisconnect.forEach(element => {
        element.close();
    });
    socketDisconnect = [];

    let route = null;
    if (params.length > 3)
    {
        route = urlRoutes[404];
        console.log("here");
    }
    else
        route = urlRoutes[parsedUrl] || urlRoutes[404];

    if (parsedUrl === "/userid/:id")
        route.exec(request.id);
    else if (parsedUrl === "/1vs1local")
        route.exec(1,  {game:"justTwo", vs1: "player1", vs2: "player2"});
    else if (parsedUrl === "/bot")
        route.exec(0, {game:"bot", vs1: "player1", vs2: "bot"});
    else
        route.exec();
}




document.addEventListener("click", (e) => {
    const {target} = e;
    if (!target.matches("nav a"))
        return;
    console.log('click event');
    e.preventDefault();
    urlRoute();
})

const pushUrl = (href) => {
    history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  };


const urlRoute = (event) => {
    event = event || window.event;  // is this mandatory

    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    deleteEvent.forEach(element => {
        element.elem.removeEventListener(element.evnt, element.fun);
    });
    deleteEvent = [];
    urlLocationHandler();
}


async function AJAX_(req)
{
    try
    {
        res = await fetch(req);
        js = await res.json();
        return js;
    }
    catch (error)
    {
        return {message: "ERROR"};
    }
}


async function checkAuthenticationStatus()
{
    const request = new Request(
        'http://127.0.0.1:8000/profile/auth/',
        {
            method: 'GET',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.
        }
    );
    answer = await AJAX_(request);
    console.log(answer.message);
    return answer.message == "authenticated";
}



/************************************************* Url routes ******************************************** */

urlRoutes = {
    404: {
        exec : async ()=>{
            document.getElementById("content").innerHTML = '<h1> not found </h1>';
        }
    },
    '/': {
        exec : homeView
    },
    '/signin':{
        exec : signInView
    },
    '/search':{
        exec : searchView
    },
    '/userid/:id': {
        exec : userProfileView
    },
    '/1vs1remote': {
        exec : pongRemoteView
    },
    '/settings': {
        exec : settingView
    },
    '/1vs1local': {
        exec : localPong
    },
    '/bot': {
        exec : localPong
    },
    '/tournament': {
        exec : tournamentView
    }
}


/************************************************* signInView ****************************************** */

async function signInView()
{
        async function example(e)
        {
            e.preventDefault();
            var form = document.getElementById('frm');
            var formData = new FormData(form);
            const request = new Request(
                'http://127.0.0.1:8000/profile/signin/',
                {
                    method: 'POST',
                    headers: {'X-CSRFToken': csrftoken},
                    mode: 'same-origin',
                    body: formData,
                }
            );
            res = await fetch(request);
            js = await res.json();
            if (js.message === "Success")
            {
                const chatSocket = new WebSocket(
                    'ws://'
                    + window.location.host
                    + '/ws/onlineUser/'
                    + '3'
                    + '/'
                );
                socketDisconnect.push(chatSocket);
                ididOnline = true
                pushUrl("/");
            }
            else if (js.message === "invalid password")
            {
                alert("invalid password");
            }
            else if (js.message === "not found")
            {
                alert("user not found");
            }
        }

        const isAuthenticated = await checkAuthenticationStatus();

        if (isAuthenticated) {
            document.getElementById("content").innerHTML = "<p>Welcome back!</p>";
            return;
        } 

        document.getElementById("content").innerHTML = '<h1> signin </h1>\
        <form id="frm" action="" method="POST">\
            <input type="text" name="username" placeholder="Username" ><br />\
            <input type="password" name="password" placeholder="Password"><br/>\
            <button type="submit">Login</button>\
            <p> Not registered? <a href="/signup" class=""> Create a account </a></p>\
        </form>';
        
        
        
        let d = document.querySelector("#frm");

        d.addEventListener("submit" , example)

        deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
}

/***************************************Home View********************************************************** */

async function homeView ()
{
    const isAuthenticated = await checkAuthenticationStatus();

    if (isAuthenticated) {
        document.getElementById("content").innerHTML = "<p>Home</p>";
        return;
    }
    pushUrl("/signin");
}

/****************************************Search View******************************************************** */

async function searchView()
{
    async function example(e)
    {
        e.preventDefault();
        var form = document.getElementById('frm');
        var formData = new FormData(form);
        const request = new Request(
            'http://127.0.0.1:8000/profile/search/?' + new URLSearchParams(formData).toString(),
            {
                method: 'GET',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin', // Do not send CSRF token to another domain.
            }
        );
        let res = await fetch(request);
        let js = await res.json();
        
        const userListElement = document.getElementById('users-id');
        userListElement.innerHTML = '';
        if (!js.length)
        {
            const userElement = document.createElement('div');
            userElement.textContent = "no user found with this name";
            userListElement.appendChild(userElement);
            return;
        }
        // Clear previous content
    
        // Render users
        js.forEach(user => {
            const userElement = document.createElement('div');
            const userLink = document.createElement('a');
            userLink.textContent = `Username: ${user.username}`;
            userLink.href = `/userid/${user.id}`; // Use a unique identifier for each user
            
            userLink.addEventListener('click', (event) => {
                event.preventDefault();
                pushUrl(`/userid/${user.id}`);
            });
            
            userElement.appendChild(userLink);
            userListElement.appendChild(userElement);
        });
    }

    const isAuthenticated = await checkAuthenticationStatus();
    if (!isAuthenticated) {
        pushUrl("/signin");
        return;
    }



    document.getElementById("content").innerHTML = '<h1> search </h1>\
    <form id="frm" action="" method="POST">\
        <div>\
            <input type="search" id="mySearch" name="q" />\
            <button type="submit">Search</button>\
        </div>\
    </form>\
    <div id="users-id"></div>\
    <div id="user-profile"></div>';
    
    let d = document.querySelector("#frm");

    d.addEventListener("submit" , example)

    deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
}


window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();

/*****************************************user profile********************************************************** */


async function userProfileView (id)
{
    const isAuthenticated = await checkAuthenticationStatus();

    if (!isAuthenticated) {
        pushUrl("/signin");
        return;
    }

    loadUserProfile(id);
}


async function loadUserProfile(userId) {
    // Fetch user profile data based on the userId
    // Update the content of your SPA with the user profile information
    try {
        console.log(userId);
        let jj = `http://127.0.0.1:8000/profile/userid/${userId}/`;
        const request = new Request(
            jj,
            {
                method: 'GET',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin', // Do not send CSRF token to another domain.
            }
        );
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userProfile = await response.json();

        document.getElementById('content').innerHTML = '<div id="user-profile"></div>';


        renderUserProfile(userProfile);
    } catch (error) {
        console.error('Error loading user profile:', error);
        document.getElementById('content').innerHTML = '<div>Error loading user profile</div>';

    }
}

function renderUserProfile(userProfile) {
    const userProfileElement = document.getElementById('user-profile');
    userProfileElement.innerHTML = `
        <h2>User Profile</h2>
        <p>Username: ${userProfile.username}</p>
        <p>Email: ${userProfile.email}</p>
        <p>wins: ${userProfile.wins}</p>
        <p>loses: ${userProfile.loses}</p>
        <p>status: ${userProfile.status}</p>
        <img src="${userProfile.avatar}" />
    `;
}

/*******************************Settings**************************************** */

async function settingView () 
{
    async function example(e)
    {
        e.preventDefault();
        var form = document.getElementById('frm');

        var formData = new FormData(form);
        console.log(formData)
        const request = new Request(
            'http://127.0.0.1:8000/profile/update/',
            {
                method: 'PATCH',
                mode: 'same-origin', // Do not send CSRF token to another domain.
                body: formData,
                headers: {'X-CSRFToken': csrftoken},
            }
        );
        res = await fetch(request);
        js = await res.json();
        console.log(js);

    }
    
    document.getElementById("content").innerHTML = '<h1> Settings </h1>\
    <form id="frm" action="" method="POST">\
        <div>\
        <input type="file" id="file" placeholder="upload a file"   \
        name="avatar">\
        <input type="email" placeholder="email"   \
        name="email">\
        <button type="submit">submit</button>\
        </div>\
    </form>';
    d = document.querySelector("#frm");

    d.addEventListener("submit" , example)

    deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
}



/********************************************** 1vs1remote ******************************************* */

async function pongRemoteView()
{
    document.getElementById("content").innerHTML = '<div class="ddd">\
                        <h2 id="player11"></h1>\
                        <h2 id="player22"></h1>\
                        <p id="timer"></p>\
                        <canvas id="canvas"></canvas>\
                        <h1 id="player1">0</h1>\
                        <h1 id="player2">0</h1>\
                    <div>';

    const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/pongTest/'
    + '3'
    + '/'
    );
    socketDisconnect.push(chatSocket);

    let iamuser = 0;
    chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    if (data.message.action == 'iam' )
      iamuser = data.message.iam;
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
        remoteIncreaseScore(data.message.paddle_1.s, data.message.paddle_1.score);
        remoteIncreaseScore(data.message.paddle_2.s, data.message.paddle_2.score);
    }
    else if (data.message.action === 'users')
    {
        document.getElementById("player22").textContent = data.message.user2;
        document.getElementById("player11").textContent = data.message.user1;
        var loop = function (count)
        {
            if (count > 0) {
                document.getElementById("timer").textContent = count--;
                timer = setTimeout(loop, 1000, count);
            } else {
                document.getElementById("timer").textContent = '';
                clearTimeout(timer);
            }
        }
    
        // start the countdown
        loop(4);
    }
};

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 1000;
    canvas.height = 600;

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
    deleteEvent.push ({'elem' : window, 'evnt': 'keydown', 'fun': onKeyDownEvent });
}

/**********1vs1remote utils********************** */


function vec2(x, y)
{
  return {x: x, y : y};
}

function remoteIncreaseScore(player, score) {
  if (player === 2)
  {
    document.getElementById("player2").innerHTML = score;
  }
  if (player === 1)
  {
    document.getElementById("player1").innerHTML = score;
  }
}

function drawSceneGame()
{
  ctx.strokeStyle = "#49243E";

  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.moveTo(0,0);
  ctx.lineTo(canvas.width, 0 );
  ctx.stroke();


  ctx.beginPath();
  ctx.lineWidth = 20;
  ctx.moveTo(0,canvas.height);
  ctx.lineTo(canvas.width, canvas.height );
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(canvas.width,0);
  ctx.lineTo(canvas.width, canvas.height );
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(0, 0);
  ctx.lineTo(0, canvas.height );
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.lineWidth = 5;
  ctx.stroke();

}

function remoteGameLoop()
{
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.fillRect(0,0,canvas.width, canvas.height);
}

function drawBall(x, y, radius)
{
  ctx.fillStyle = "#33ff00";
  ctx.strokeStyle =  "#33ff00";
  ctx.beginPath ();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPaddle(x, y, width, height)
{
  ctx.fillStyle  = "#BB8493";
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [70]);
  ctx.fill();
}


/************************************local game ************************************************ */



async function localPong(isVsBot, objConf)
{
    document.getElementById("content").innerHTML = '<div class="ddd">\
                        <h2 id="player11"></h1>\
                        <h2 id="player22"></h1>\
                        <p id="timer"></p>\
                        <canvas id="canvas"></canvas>\
                        <h1 id="player1">0</h1>\
                        <h1 id="player2">0</h1>\
                    <div>';
                    const canvas = document.getElementById('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (objConf.game === 'tournament'){

                        document.getElementById('player11').textContent = objConf.vs1;
                        document.getElementById('player22').textContent = objConf.vs2;
                        
                    }
                    canvas.width = 1000;// window.innerWidth;
                    canvas.height = 600;//window.innerHeight;
    let flag = isVsBot;

    const keyPressed = [];
    const KEY_UP = 87;
    const KEY_DOWN = 83;
    
    const KEY_UP_RIGHT = 38;
    const KEY_DOWN_RIGHT  = 40;
    window.addEventListener("keydown", (e) => {
      console.log(e.keyCode);
      keyPressed[e.keyCode] = true;
    })
    window.addEventListener("keyup", (e) => {
      // console.log(e.keyCode);
      keyPressed[e.keyCode] = false;
    })


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
        ctx.fillStyle = "#33ff00";
        ctx.strokeStyle =  "#33ff00";
        ctx.beginPath ();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
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
        ctx.fillStyle  = "#BB8493";
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
      if (ball.pos.y + ball.radius >= canvas.height || ball.pos.y - ball.radius <= 0 )
        ball.velocity.y *= -1;

    }


    function ballPaddleCollision(ball, paddle)
    {
      let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
      let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

      if (dx < (ball.radius + paddle.getHalfWidth()) && dy < (paddle.getHalfHeight() + ball.radius))
      {
        if (paddle.s === 1)
          ball.pos.x = (paddle.pos.x + paddle.width) + ball.radius;  // if ball gets stuck
        else
          ball.pos.x = paddle.pos.x - paddle.width - ball.radius; // if ball gets stuck

        ball.velocity.x *= -1;
      }
    }


    function player2ai (ball, paddle) {
      // paddle.pos
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
      if (ball.velocity.x < 0)
      {
          ball.pos.x = 150;
          ball.pos.y = (Math.random() * (canvas.height - 200)) + 100;
      }
      ball.velocity.x *= -1;
      ball.velocity.y *= -1;
    }

    function increaseScore(ball, paddle_1, paddle_2)
    {
      if (ball.pos.x <= -ball.radius)
      {
        paddle_2.score += 1;
        document.getElementById("player2").innerHTML = paddle_2.score;
        respawnBall(ball)
      }
      if (ball.pos.x >= canvas.width + ball.radius)
      {
        paddle_1.score += 1;
        document.getElementById("player1").innerHTML = paddle_1.score;
        respawnBall(ball)
      }
    }

    function drawSceneGame()
    {
      ctx.strokeStyle = "#49243E";

      ctx.beginPath();
      ctx.lineWidth = 20;
      ctx.moveTo(0,0);
      ctx.lineTo(canvas.width, 0 );
      ctx.stroke();


      ctx.beginPath();
      ctx.lineWidth = 20;
      ctx.moveTo(0,canvas.height);
      ctx.lineTo(canvas.width, canvas.height );
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.moveTo(canvas.width,0);
      ctx.lineTo(canvas.width, canvas.height );
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvas.height );
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height );
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height / 2, 50, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.stroke();

    }

    const ball = new Ball (vec2(20,20), vec2(7, 7), 10);
    const paddle1 = new Paddle(vec2(0,70), vec2(10,10), 20 ,100,1, objConf.vs1);
    const paddle2 = new Paddle(vec2(canvas.width - 20, 20), vec2(10,10), 20 ,100,2, objConf.vs2);

    
    flag = isVsBot;
    function gameUpdate() {
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
    }
    
    function gameDraw() {
      ball.draw();
      paddle1.draw();
      paddle2.draw();
      drawSceneGame();
    }
    function gameLoop()
    {

      // ctx.clearRect(0, 0 , canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.fillRect(0,0,canvas.width, canvas.height);
    //   window.requestAnimationFrame(gameLoop);
        gameUpdate();
        gameDraw();
        if (paddle2.score >= 5 || paddle1.score >= 5)
        {
            let obj = objConf;
            clearInterval(id);
            id = -1;
            if (obj.game === "bot" || obj.game === "justTwo")
            {
                if (paddle2.score >= 5 )
                    alert (`winner ${paddle2.username}`);
                else
                    alert (`winner ${paddle1.username}`);
                return;
            }
            else
            {
                if (paddle2.score >= 5 && obj.partGame === 0)
                    obj.win1 = paddle2.username;
                else if (paddle1.score >= 5 && obj.partGame === 0)
                    obj.win1 = paddle1.username;

                if (paddle2.score >= 5 && obj.partGame === 1)
                    obj.win2 = paddle2.username;
                else if (paddle1.score >= 5 && obj.partGame === 1)
                    obj.win2 = paddle1.username;
                if (obj.partGame === 0)
                    obj.partGame = 1;
                else if (obj.partGame === 1)
                    obj.partGame = 2;
                else if (obj.partGame === 2)
                {
                    if (paddle2.score >= 5 )
                        alert (`winner ${paddle2.username}`);
                    else
                        alert (`winner ${paddle1.username}`);
                    return ;
                }

                if (obj.partGame === 1)
                {
                    obj.vs1 = obj.player3;
                    obj.vs2 = obj.player4;
                    localPong(1, obj);
                }
                else
                {
                    obj.vs1 = obj.win1;
                    obj.vs2 = obj.win2;
                    localPong(1, obj);
                }
            }
        }
    
}



    id = setInterval(gameLoop, 10)


}



/*************************************Tournament view**************************************** */

async function tournamentView()
{
    document.getElementById("content").innerHTML = '\
    <h1>Enter Player Names</h1>\
    <form id="playerForm">\
        <label for="player1">Player 1:</label>\
        <input type="text" id="player1" name="player1" required placeholder="Enter Name"><br>\
        \
        <label for="player2">Player 2:</label>\
        <input type="text" id="player2" name="player2" required placeholder="Enter Name"><br>\
        \
        <label for="player3">Player 3:</label>\
        <input type="text" id="player3" name="player3" required placeholder="Enter Name"><br>\
        \
        <label for="player4">Player 4:</label>\
        <input type="text" id="player4" name="player4" required placeholder="Enter Name"><br><br>\
        \
        <button type="submit">Submit</button>\
    </form>';
    const playerForm = document.getElementById('playerForm');

        playerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const player1 = document.getElementById('player1').value;
            const player2 = document.getElementById('player2').value;
            const player3 = document.getElementById('player3').value;
            const player4 = document.getElementById('player4').value;

            // Now you have the player names in variables: player1, player2, player3, player4

            // You can process the names here (e.g., display them, store them)
            console.log("Player 1:", player1);
            console.log("Player 2:", player2);
            console.log("Player 3:", player3);
            console.log("Player 4:", player4);

            // Example: Display names in an alert
            // alert(`Players: ${player1}, ${player2}, ${player3}, ${player4}`);
            let obj = {
                game:"tournament",
                vs1: player1,
                vs2: player2,
                'player1' : player1,
                'player2' : player2,
                'player3' : player3,
                'player4' : player4,
                partGame : 0,
            }
            localPong(1, obj)

        });
}