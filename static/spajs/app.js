import {tuto} from './views/views.js'
import {dataGlobal, url} from './views/globalData.js'
import {homeView} from './views/home.js'
import {urlLocationHandler} from './utils/locationHandles.js'
import {urlRoute} from './utils/urlRoute.js'
import { pushUrl } from './utils/urlRoute.js'
import { checkAuthentication } from './views/checkAuth.js'
import { signin } from './views/signin.js'
import { twofaView } from './views/twofa.js'
import { getLanguage } from './views/getLanguage.js'



document.getElementById("logout").addEventListener('click', async (e)=>{
    e.preventDefault();
    try
    {
        const request = new Request(
            '/api/logout/',
            {
                method: 'GET',
            }
        );
        let res = await fetch(request);
        let js = await res.json();
        if (js.message === "success")
        {
            document.querySelector("#navi").classList.add("hideme");
            dataGlobal.socketOnline.close();
            dataGlobal.socketOnline.close();
            dataGlobal.sentOnline = false;
            dataGlobal.selectedLanguage = "en",
            dataGlobal.gotData = false
            pushUrl('/signin');
        }
    }
    catch (err)
    {
    }
    pushUrl('/signin');
})

document.getElementById("home").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/');
})

document.getElementById("search").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/search');
})

document.getElementById("friends").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/s');
})
document.getElementById("set").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/settings');
})


// tuto();
console.log(url);
// homeView();

async function ini()
{

// Some random colors
const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const numBalls = 70;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 90)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 90)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}


    if (!history.state) {
        const initialHref = window.location.pathname;
        console.log("Initializing history with initial state:", initialHref);
        history.replaceState({ href: initialHref }, '', initialHref);
    }

    window.onpopstate = urlLocationHandler;
    window.route = urlRoute;

    const authStatus = await checkAuthentication();
    console.log(authStatus);
    if (authStatus === "2fa") {
        if (window.location.pathname !== '/twofa')
            pushUrl('/twofa');
        else
            twofaView();
        return;
    }
    else if (authStatus === 'signin')
    {
        console.log('authStatus');
        if (window.location.pathname !== '/signin')
            pushUrl('/signin');
        else
            signin()
        return ;
    }
    document.querySelector(".hideme").classList.remove("hideme");


    let lang = await getLanguage();
    if (lang != "ERR")
        dataGlobal.selectedLanguage = lang;
    urlLocationHandler();
}

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    ini()
  });