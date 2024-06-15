import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal } from "./globalData.js";
import { sendOnline } from "./online.js";
export async function checkAuthentication()
{
    const request = new Request(
        '/api/auth/',
        {
            method: 'GET',
        }
    );
    
    let answer = await AJAX_(request);
    console.log('message');
    console.log(answer.message);
    if (answer.message === "authenticated")
    {
        if (!dataGlobal.sentOnline)
        {
            sendOnline();
        }
        return 'authenticated';
    }
    if (answer.message === "2fa")
        return '2fa'
        //pushUrl('/twofa');
    else
        return 'signin'
    //    pushUrl('/signin');
}


export async function AJAX_(req)
{
    try
    {
        let res = await fetch(req);
        console.log(`status code ${res.status}`);
        let js = await res.json();
        return js;
    }
    catch (error)
    {
        return {message: "ERROR"};
    }
}
