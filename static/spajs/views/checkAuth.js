import { pushUrl } from "../utils/urlRoute.js";

export async function checkAuthentication()
{
    const request = new Request(
        '/profile/auth/',
        {
            method: 'GET',
        }
    );
    let answer = await AJAX_(request);
    // if (answer.message === "authenticated")
        // return ;
    // if (answer.message === "2fa")
        // pushUrl('/twofa');
    // else
        // pushUrl('/signin');
}


async function AJAX_(req)
{
    try
    {
        res = await fetch(req);
        js = await res.json();
        return js;
    }
    catch (error)
    {
        return {message: "ERROR"};
    }
}
