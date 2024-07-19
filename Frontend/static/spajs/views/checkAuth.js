import { dataGlobal } from "./globalData.js";
import { sendOnline } from "./online.js";

export async function checkAuthentication()
{
    try
    {
        const request = new Request(
            '/api/auth/',
            {
                method: 'GET',
            }
        );
        
        let answer = await AJAX_(request);
    
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
        else
            return 'signin'
    }
    catch (err)
    {
        // console.log('checkauth')
        return 'signin'
    }
}


export async function AJAX_(req)
{
    try
    {
        let res = await fetch(req);
        let js = await res.json();
        return js;
    }
    catch (error)
    {
        // console.log('ajax')
        return {message: "ERROR"};
    }
}
