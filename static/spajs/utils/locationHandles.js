import {searchView } from "./../views/search.js"
import {homeView } from "./../views/home.js"
import {profileFriend} from "./../views/profileFriend.js"
import {localPong} from "./../views/localGame.js"
import {settingView} from "./../views/settings.js"

export async function urlLocationHandler()
{

    const location = window.location.pathname;
    if (!location.length)
        location = "/";

    const params = location.split('/');

    const request = {
      resource: params[1] || null,
      id: params[2] || null,
    };

    const parsedUrl =  (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '')


    if (parsedUrl === "/userid/:id")
    {
        profileFriend(request.id);
        return;
    }


    console.log("locationHandler");
    let path = window.location.pathname
    if (path === "/search")
    {
        searchView()
    }
    else if (path === "/localgame")
    {
        localPong(1,  {game:"justTwo", vs1: "player1", vs2: "player2"}); 
    }
    else if (path === "/s")
    {
        // return;
        settingView();

    }
    else
    {
        console.log("rrrrrrrrrr");
        homeView();
    }
}

