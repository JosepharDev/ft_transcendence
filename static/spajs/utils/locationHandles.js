import {searchView } from "./../views/search.js"
import {homeView } from "./../views/home.js"
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
import { remoteGame4 } from "../views/fourvsfour.js"
import { remoteTournament } from "../views/tournamentRem.js"
import { signup } from "../views/signup.js"


export async function urlLocationHandler()
{
    console.log('popstate');

    closSockets(dataGlobal);
    removeEvents(dataGlobal);

    const location = window.location.pathname;
    if (!location.length)
        location = "/";
    
    const params = location.split('/');


    let path = window.location.pathname
    if (params.length > 3)
        path = '/';

    const request = {
      resource: params[1] || null,
      id: params[2] || null,
    };

    const parsedUrl =  (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '')

    if (location === '/signin')
    {
        console.log("YOO");
        signin();
        return ;
    }
    else if (location === '/twofa')
    {
        twofaView();
        return ;
    }


    console.log("locationHandler");


    if (parsedUrl === "/userid/:id")
        profileFriend2(request.id, false);
    else if (path === '/remote')
        remoteGame1();
    else if (path === "/search")
        searchView()
    else if (path === "/localgame")
        localPong(1,  {game:"justTwo", vs1: "player1", vs2: "player2"}); 
    else if (path === "/remote4")
        remoteGame4();
    else if (path === "/s")
        profileFriend2(0, true);
        // friendsView();
    else if (path === "/settings")
        settingView();
    else if (path === "/tournament")
        remoteTournament();
    else if (path === "/bot")
        localPong(1,  {game:"justTwo", vs1: "player1", vs2: "player2"});
    else if (path === "/signup")
        signup()
    else
        homeView(); // this will change just button to start
}

