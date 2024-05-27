import {searchView } from "./../views/search.js"
import {homeView } from "./../views/home.js"
import {profileFriend} from "./../views/profileFriend.js"
import {localPong} from "./../views/localGame.js"
import {settingView} from "./../views/settings.js"
import {profileFriend2} from "./../views/profile2.js"
import {remoteGame1} from "./../views/remote1.js"


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
    
    console.log("Lolo")

    if (parsedUrl === "/userid/:id")
    {
        profileFriend2(request.id);
        return;
        profileFriend(request.id);
    }


    console.log("locationHandler");
    let path = window.location.pathname
    if (path === '/remote')
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
        // return;
        // settingView();
        profileFriend2(3);

    }
    else
    {
        console.log("rrrrrrrrrr");
        homeView();
    }
}

