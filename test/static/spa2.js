let ididOnline = false;

socketDisconnect = [];


const urlRoutes = {
    404: {
        template : "404.html",
        title : "",
        description: "" ,
        exec : async ()=>{
            document.getElementById("content").innerHTML = '<h1> not found </h1>\
          </div>';

        }
    },

    '/' : {
        template : "/profile",
        title : "",
        description: "",
        exec : async ()=>{
            const isAuthenticated = await checkAuthenticationStatus();
            if (isAuthenticated) {
                // document.getElementById("content").innerHTML = "<p>Welcome back!</p>";
                return;
            }
            pushUrl("/signin");

        }
    },
    '/userid/:id' : {
        template : "/profjfdjkfhdjkfjile",
        title : "",
        description: "",
        exec : async (id)=>{
            document.addEventListener('keydown', handleKeyDown);
            deleteEvent.push ({'elem' : document, 'evnt': 'keydown', 'fun': handleKeyDown });

            loadUserProfile(id);
            console.log("ok");
            // pushUrl("/signin");

        }
    },
/*
<form>
  <div>
    <input type="search" id="mySearch" name="q" />
    <button>Search</button>
  </div>
</form>

*/

    '/search' : {
        template : "/profile",
        title : "",
        description: "",
        exec : () => {


            async function example(e)
            {
                e.preventDefault();
                console.log("signin");
                // const formData = new FormData(form);
                // const queryString = new URLSearchParams(formData).toString();
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
                res = await fetch(request);
                js = await res.json();
                
                console.log(js);


                const userListElement = document.getElementById('users-id');

                // Clear previous content
                userListElement.innerHTML = '';
            
                // Render users
                js.forEach(user => {
                    const userElement = document.createElement('div');
                    const userLink = document.createElement('a');
                    userLink.textContent = `Username: ${user.username}, Email: ${user.email}`;
                    userLink.href = `#${user.username}`; // Use a unique identifier for each user
                    userLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        // Load user profile content based on the unique identifier (e.g., username)
                        pushUrl(`/userid/${user.id}`);


                    });
                    userElement.appendChild(userLink);
                    userListElement.appendChild(userElement);
                });


            }


            
            document.getElementById("content").innerHTML = '<h1> signin </h1>\
            <form id="frm" action="" method="POST">\
                <div>\
                <input type="search" id="mySearch" name="q" />\
                <button type="submit">Search</button>\
                </div>\
            </form>\
            <div id="users-id"></div>\
            <div id="user-profile"></div>';
            
            d = document.querySelector("#frm");

            d.addEventListener("submit" , example)

            deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
        }
    },

    '/signin' : {
        template : "/profile",
        title : "",
        description: "",
        exec : async ()=> {

            async function example(e)
            {
                e.preventDefault();
                console.log("signin");

                var form = document.getElementById('frm');
                var formData = new FormData(form);
                const request = new Request(
                    'http://127.0.0.1:8000/profile/signin/',
                    {
                        method: 'POST',
                        headers: {'X-CSRFToken': csrftoken},

                        mode: 'same-origin', // Do not send CSRF token to another domain.
                        body: formData,
                    }
                );
                res = await fetch(request);
                js = await res.json();
                console.log(js);
                if (js.message === "Success")
                {
                    console.log("why iadddddddddddddddddddddddm hree")

                    const chatSocket = new WebSocket(
                        'ws://'
                        + window.location.host
                        + '/ws/onlineUser/'
                        + '3'
                        + '/'
                    );
                    ididOnline = true
                    const request = new Request(
                        'http://127.0.0.1:8000/profile/signin/',
                        {
                            method: 'GET',
                            headers: {'X-CSRFToken': csrftoken},
                            mode: 'same-origin', // Do not send CSRF token to another domain.
                        }
                    );
                    res = await fetch(request);
                    js = await res.json();
                    console.log(js);
                    document.getElementById("content").innerHTML = `<img src="${js.avatar}">\
                        </img>` ;
                    // pushUrl("/");
                }

            }

            const isAuthenticated = await checkAuthenticationStatus();

            if (isAuthenticated) {
                document.getElementById("content").innerHTML = "<p>Welcome back!</p>";
                return;
            } 

            // console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeehaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            document.getElementById("content").innerHTML = '<h1> signin </h1>\
            <form id="frm" action="" method="POST">\
                <input type="text" name="username" placeholder="Username" ><br />\
                <input type="password" name="password" placeholder="Password"><br/>\
                <button type="submit">Login</button>\
                <p> Not registered? <a href="/signup" class=""> Create a account </a></p>\
            </form>';
            d = document.querySelector("#frm");

            const request = new Request(
                'http://127.0.0.1:8000/profile/signin/',
                {
                    method: 'GET',
                    headers: {'X-CSRFToken': csrftoken},
                    mode: 'same-origin', // Do not send CSRF token to another domain.
                }
            );
            res = await fetch(request);
            js = await res.json();
            console.log(js);
            d.addEventListener("submit" , example)

            deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });

        }
    },




    '/update' : {
        template : "/profile",
        title : "",
        description: "",
        exec : () => {


            async function example(e)
            {
                e.preventDefault();
                // console.log("signin");
                // const formData = new FormData(form);
                // const queryString = new URLSearchParams(formData).toString();
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


            
            document.getElementById("content").innerHTML = '<h1> signin </h1>\
            <form id="frm" action="" method="POST">\
                <div>\
                <input type="file" id="file" placeholder="upload a file"   \
                name="avatar">\
                <input type="email"  placeholder="enail"   \
                name="email">\
                <button type="submit">Search</button>\
                </div>\
            </form>';
            d = document.querySelector("#frm");

            d.addEventListener("submit" , example)

            deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
        }
    },
/*********************************** */
    '/1vs1remote':
    {
        exec: async () => {

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
    let k = 0;
    let iamuser = 0;
    chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            // console.log(data);
            if (data.message.action == 'iam' )
              iamuser = data.message.iam;
            if (data.message.action == 'logged')
              console.log("logged");
            else if (data.message.action == 'ball')
              drawBall(data.message.ball.pos.x, data.message.ball.pos.y, data.message.ball.radius);
            else if (data.message.action == 'paddle')
            {
              console.log('here')
              drawPaddle(
                data.message.pos.x,
                data.message.pos.y,
                data.message.width,
                data.message.height
              );
            }
            else if (data.message.action === 'data'){

              // console.log("====>" , data.message.paddle_1.pos.x);
              gameLoop();
              drawBall(data.message.ball.pos.x, data.message.ball.pos.y, data.message.ball.radius);
              console.log("====> ", data.message.ball.pos.x, " ", data.message.ball.pos.y);
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
              increaseScore(data.message.paddle_1.s, data.message.paddle_1.score);
              increaseScore(data.message.paddle_2.s, data.message.paddle_2.score);
            }
            else if (data.message.action === 'users')
            {
                document.getElementById("player22").textContent = data.message.user2;
                document.getElementById("player11").textContent = data.message.user1;
                var loop = function (count) {
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
    
    canvas.width = 1000;// window.innerWidth;
    canvas.height = 600;//window.innerHeight;

    window.addEventListener("keydown", (e) => {
        if (e.keyCode != 38 && e.keyCode != 40)  
          return;
      console.log(e.keyCode);
    //   keyPressed[e.keyCode] = true;
    console.log ("ssssssssssssssssssssssssssssssssssssssssssss")
      let msg = {
        'action': 'press',
        'key' : "D",
        'user' : iamuser,
        'code': e.keyCode,
      }
    console.log (msg)
    console.log (iamuser)

      chatSocket.send(JSON.stringify(msg));
    })

        }
    }

/************************************** */

};
let canvas = null ;
let ctx  = null;
/*;


*/
const pushUrl = (href) => {
    history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  };

deleteEvent = []

function handleKeyDown(e)
{
    console.log('kkkk');
}


document.addEventListener("click", (e) => {
    const {target} = e;
    if (!target.matches("nav a"))
        return;
    console.log('click event');
    e.preventDefault();
    urlRoute();
})


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

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");


const urlLocationHandler = async () => {
    const location = window.location.pathname;
    if (!location.length)
        location = "/";

    const params = location.split('/');

    // Build request variable.
    const request = {
      resource: params[1] || null,
      id: params[2] || null,
    };
    // const { resource, id } = request;
    const parsedUrl =  (request.resource ? '/' + request.resource : '/') +
    (request.id ? '/:id' : '')
    // console.log("bla");
    console.log(params);
    // console.log(resource);

    deleteEvent.forEach(element => {
        element.elem.removeEventListener(element.evnt, element.fun);
    });
    deleteEvent = [];
    socketDisconnect.forEach(element => {
        element.close();
    });
    socketDisconnect = [];
    const route = urlRoutes[parsedUrl] || urlRoutes[404];
    console.log("roooooooo");
    console.log(location);
    if (location === "/signin")
    {
        console.log("teeeeeeeeeeeest");
        route.exec();
    }
    else if (location === "/1vs1remote")
        route.exec();
    else if (location === "/search" || location === "/update")
        route.exec();
    else if (parsedUrl === "/userid/:id")
    {
        route.exec(request.id);
        
    }
    else if (route === urlRoutes[404])
        route.exec();
    else
    {
    console.log("bla");

        urlRoutes['/'].exec();
        document.getElementById("content").innerHTML = "<p>example</p>";
    }
}


window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();

async function p ()
{
    const isAuthenticated = await checkAuthenticationStatus();
    if (!isAuthenticated) {
        // document.getElementById("content").innerHTML = "<p>Welcome back!</p>";
        pushUrl("/signin");
        return ;
    }
    if (!ididOnline)
    {
        console.log("why iam hree")
        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/onlineUser/'
            + '3'
            + '/'
        );
        ididOnline = true;
    }
}

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
p();

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
    res = await fetch(request);
    js = await res.json();
    return js.message === "authenticated";
}





async function loadUserProfile(username) {
    // Fetch user profile data based on the username
    // Update the content of your SPA with the user profile information
    try {
        console.log(username);
        let jj = `http://127.0.0.1:8000/profile/userid/${username}/`
        // console.log(`'http://127.0.0.1:8000/profile/userid/${username}/`);
        const request = new Request(
            jj,
            {
                method: 'GET',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin', // Do not send CSRF token to another domain.
            }
        );
        const response = await fetch(request); // Endpoint to fetch user profile data
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userProfile = await response.json();
        // Render user profile content in your SPA
        console.log(userProfile);
        renderUserProfile(userProfile);
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function renderUserProfile(userProfile) {
    // Update the content of your SPA with the user profile information
    // For example, display user profile details in a specific section of your webpage
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

















/********************************game***************************************************************** */





function vec2(x, y)
{
  return {x: x, y : y};
}

function increaseScore(player, score) {
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
  // eUpdate();
  // gameDraw();

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

// const ball = new Ball (vec2(20,20), vec2(7, 7), 10);
// const paddle1 = new Paddle(vec2(0,70), vec2(10,10), 20 ,100,1);
// const paddle2 = new Paddle(vec2(canvas.width - 20, 20), vec2(10,10), 20 ,100,2);


// function gameUpdate() {
//   // ball.update();
//   paddle1.update();
//   paddleCollisionWithEdges(paddle1);
//   if (!flag)
//     player2ai(ball, paddle2);
//   else
//     paddle2.update();
//   paddleCollisionWithEdges(paddle2);

//   ballCollisionWithEdges(ball);

//   ballPaddleCollision(ball, paddle1);
//   ballPaddleCollision(ball, paddle2);
//   increaseScore(ball, paddle1, paddle2)
//   keyPressed[KEY_DOWN] = false;
//   keyPressed[KEY_DOWN_RIGHT] = false;
//   keyPressed[KEY_UP] = false;
//   keyPressed[KEY_UP_RIGHT] = false;

// }

function gameDraw()
{
  ball.draw();
  paddle1.draw();
  paddle2.draw();
  drawSceneGame();
}
function gameLoop()
{

  // ctx.clearRect(0, 0 , canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // gameUpdate();
  // gameDraw();

  

}



// gameLoop();



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
  console.log(`y = ${y}`);
  /*ctx.fillRect (x, y, width, height);*/
  
  
  ctx.fillStyle  = "#BB8493";
  /*ctx.strokeStyle = "blue";*/
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, [70]);
  ctx.fill();
}