export let url = {
    'signin' : 'runthis'
};

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

export function removeEvents(data)
{
    data.deleteEvent.forEach(element => {
        element.elem.removeEventListener(element.evnt, element.fun);
    });
    data.deleteEvent = [];
}

export function logout()
{
    console.log('error is here');
    if (dataGlobal.socketOnline !== -1)
    {
        console.log('error is here1');
        console.log(dataGlobal.socketOnline);
        dataGlobal.socketOnline.close()
        console.log('error is here2');
        dataGlobal.socketOnline = -1;
    }
    dataGlobal.sentOnline = false
    dataGlobal.selectedLanguage = "en"
    dataGlobal.gotData = false
    console.log('not here');
}

