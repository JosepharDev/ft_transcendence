import {searchView } from "./../views/search.js"
import {homeView } from "./../views/home.js"
import {profileFriend} from "./../views/profileFriend.js"
import {localPong} from "./../views/localGame.js"
import {settingView} from "./../views/settings.js"
import {profileFriend2} from "./../views/profile2.js"
import {remoteGame1} from "./../views/remote1.js"
import {tournamentView} from "./../views/tournament.js"
import { dataGlobal, removeEvents, closSockets } from "../views/globalData.js"
import { signin } from "../views/signin.js";
import { twofaView } from "../views/twofa.js";
import { checkAuthentication } from "../views/checkAuth.js"
import {friendsView} from "../views/friends.js"
import { pushUrl } from "./urlRoute.js"

export async function urlLocationHandler()
{
    console.log('popstate');

    closSockets(dataGlobal);
    removeEvents(dataGlobal);

    const location = window.location.pathname;
    if (!location.length)
        location = "/";
    
    const params = location.split('/');

    const request = {
      resource: params[1] || null,
      id: params[2] || null,
    };
    
    const parsedUrl =  (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '')
    
    console.log("Lolo")
    console.log("Lolssssssssso")
    if (location === '/signin')
    {
        signin();
        return ;
    }
    else if (location === '/twofa')
    {
        twofaView();
        return ;
    }
    let path = window.location.pathname
    console.log("locationHandler");
    const authStatus = await checkAuthentication();
    if (authStatus === "2fa") {
        pushUrl('/twofa');
        return;
    }
    else if (authStatus === 'signin')
        {
            pushUrl('/signin');
            return ;
        }
    if (parsedUrl === "/userid/:id")
    {
        profileFriend2(request.id);
        return;
        profileFriend(request.id);
    }
    else if (path === '/remote')
        {
        remoteGame1();
    }
    else if (path === "/search")
    {
        searchView()
    }
    else if (path === "/localgame")
    {
        localPong(1,  {game:"justTwo", vs1: "player1", vs2: "player2"}); 
    }
    else if (path === "/s")
    {
        // tournamentView()
        // return;
        // settingView();
        friendsView();
        // profileFriend2(3);
    }
    else if (path === "/settings")
        {
            settingView();

        }
    else
    {
        console.log("rrrrrrrrrr");
        homeView();
    }
}

