import {searchView } from "./../views/search.js"
import {homeView } from "./../views/home.js"
import {localPingPong, localPong} from "./../views/localGame.js"
import {settingView} from "./../views/settings.js"
import {profileFriend2} from "./../views/profile2.js"
import {remoteGame1} from "./../views/remote1.js"
import { dataGlobal, removeEvents, closSockets } from "../views/globalData.js"
import { signin } from "../views/signin.js";
import { twofaView } from "../views/twofa.js";
import { checkAuthentication } from "../views/checkAuth.js"
import { remoteGame4 } from "../views/fourvsfour.js"
import { remoteTournament } from "../views/tournamentRem.js"
import { signup } from "../views/signup.js"
import { getLanguage } from "../views/getLanguage.js"



export async function urlLocationHandler()
{
    console.log('popstate');

    closSockets(dataGlobal);
    removeEvents(dataGlobal);

    
    const location = window.location.pathname;
    let path = window.location.pathname;


    if (!location.length)
        location = "/";
    
    const params = location.split('/');
    
    
    if (params.length > 3)
        path = '/';
    
    const request = {
        resource: params[1] || null,
        id: params[2] || null,
    };
    
    const parsedUrl =  (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '')
    
    
    if ( location !== '/signin' && location !== '/twofa')
    {
        if (!dataGlobal.gotData)
        {
            let dataUser = await getLanguage();
            if (dataUser.message === 'success')
            {
                document.getElementById('avatarProfile').src = dataUser.avatar;
                document.getElementById("language-selector").value = dataUser.language;
                dataGlobal.selectedLanguage = dataUser.language;
                dataGlobal.gotData = true;
            }
        }
        const nav = document.querySelector("#navi");
        if (location !== '/signup' && nav.classList.contains('hideme'))
            nav.classList.remove("hideme");

    }


    if (location === '/signin')
    {
        let ff = await checkAuthentication();
        if (ff !== 'authenticated')
        {
            console.log("(ff !== 'authenticated')");
            signin();
            return ;
        }
        const nav = document.querySelector("#navi");
        if (nav.classList.contains('hideme'))
            nav.classList.remove("hideme");
    }
    else if (location === '/twofa')
    {
        let ff = await checkAuthentication();
        if (ff !== 'authenticated')
        {
            twofaView();
            return ;
        }
        const nav = document.querySelector("#navi");
        if (nav.classList.contains('hideme'))
            nav.classList.remove("hideme");
    }


    console.log("locationHandler");


    if (parsedUrl === "/userid/:id")
        profileFriend2(request.id, false);
    else if (path === '/remote')
        remoteGame1();
    else if (path === "/search")
        searchView()
    else if (path === "/localgame")
        localPingPong()
    else if (path === "/remote4")
        remoteGame4();
    else if (path === "/s")
        profileFriend2(0, true);
    else if (path === "/settings")
        settingView();
    else if (path === "/tournament")
        remoteTournament();
    else if (path === "/signup")
        signup()
    else
        homeView();
}

