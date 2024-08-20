export let dataGlobal = {
    socketDisconnect : [],
    deleteEvent: [],
    idInterval : -1,
    idTimeOut : -1,
    csrftoken : "",
    socketOnline : -1,
    sentOnline : false,
    selectedLanguage : "en",
    gotData : false
}

export function closSockets(data)
{
    try
    {
        if (data.idInterval != -1)
        {
            clearInterval(data.idInterval);
            data.idInterval = -1;
        }
        
        if (data.idTimeOut != -1)
        {
            clearTimeout(data.idTimeOut);
            data.idTimeOut = -1;
        }
    
    
        data.socketDisconnect.forEach(element => {
            element.close();
        });
        data.socketDisconnect = [];
    }
    catch (err)
    {
        data.socketDisconnect = [];
    }
}

export function removeEvents(data)
{
    try
    {
        data.deleteEvent.forEach(element => {
            element.elem.removeEventListener(element.evnt, element.fun);
        });
        data.deleteEvent = [];
    }
    catch (err)
    {
        data.deleteEvent = [];
    }
}

export function logout()
{

    try
    {
        if (dataGlobal.socketOnline !== -1)
            dataGlobal.socketOnline.close()
    }
    catch (err)
    {
    }
    
    dataGlobal.socketOnline = -1;
    dataGlobal.sentOnline = false
    dataGlobal.selectedLanguage = "en"
    dataGlobal.gotData = false

}

