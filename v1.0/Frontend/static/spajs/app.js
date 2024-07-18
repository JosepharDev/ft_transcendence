import {dataGlobal, logout, url} from './views/globalData.js'

import {urlLocationHandler} from './utils/locationHandles.js'

import { pushUrl } from './utils/urlRoute.js'






async function ini()
{
    // try // {//s}
    // {
    //     if (!history.state) {
    //         const initialHref = window.location.pathname;
    //         history.replaceState({ href: initialHref }, '', initialHref);
    //     }
    // }
    // catch (err)
    // {
    // }


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
                logout();
                pushUrl('/signin');
                return ;
            }
        }
        catch (err)
        {
        }
    
        logout();
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
        pushUrl('/profile');
    })
    document.getElementById("set").addEventListener('click', async (e)=>{
        e.preventDefault();
        pushUrl('/settings');
    })


    window.onpopstate = urlLocationHandler;
    urlLocationHandler();
}




document.addEventListener("DOMContentLoaded", (event) => {
    ini()
  });