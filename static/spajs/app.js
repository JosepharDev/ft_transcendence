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


async function ini()
{
    try // {//s}
    {
        if (!history.state) {
            const initialHref = window.location.pathname;
            console.log("Initializing history with initial state:", initialHref);
            history.replaceState({ href: initialHref }, '', initialHref);
        }
    }
    catch (err)
    {
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

    let lang = await getLanguage();
    if (lang.message === "success")
        dataGlobal.selectedLanguage = lang.language;

    urlLocationHandler();
}




document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    ini()
  });