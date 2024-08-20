import {dataGlobal, logout} from './views/globalData.js'
import {urlLocationHandler} from './utils/locationHandles.js'
import { pushUrl } from './utils/urlRoute.js'
import { translations } from './utils/localization.js';






async function ini()
{
    try
    {

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
    
                    if (window.location.pathname !== "/signin")
                        pushUrl('/signin');
                    else
                        pushUrl('/signinr');
                    return ;
                }
            }
            catch (err)
            {
            }
        
            logout();
            if (window.location.pathname !== "/signin")
                pushUrl('/signin');
            else
                pushUrl('/signinr');
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
    
    
    
        document.getElementById("language-selector").addEventListener("change", async function() {
            const selectedLanguage = this.value;
            dataGlobal.selectedLanguage = selectedLanguage;
        
        
            document.querySelectorAll("[data-localize]").forEach(element => {
                let key = element.getAttribute("data-localize");
                if (element.hasAttribute('id'))
                {
                    if (element.id === "followBtnUser")
                    {
                        const btnVal = element.textContent;
                        if (btnVal === "Follow" || btnVal === "Seguir" || btnVal === "Suivre")
                            key = "follow";
                        else
                            key = "unfollow";
                    }
                }
                element.textContent = translations[selectedLanguage][key];
        
                if (element.hasAttribute('placeholder'))
                {
                    element.setAttribute('placeholder', translations[selectedLanguage][key]);            }
            });
        
            try
            {
                const formData = new FormData();
                formData.append('language', selectedLanguage);    
        
                const request = new Request(
                    '/api/update/language/',
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
        
        
                let res = await fetch(request);
            }
            catch (err)
            {
        
            }
        
        });
    }
    catch (err)
    {
    }


    window.onpopstate = urlLocationHandler;
    urlLocationHandler();
}




document.addEventListener("DOMContentLoaded", (event) => {
    ini()
  });