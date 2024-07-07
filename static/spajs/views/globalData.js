export let url = {
    'signin' : 'runthis'
};


export let dataGlobal = {
    socketDisconnect : [],
    deleteEvent: [],
    idInterval : -1,
    csrftoken : "",
    sentOnline : false,
    selectedLanguage : "en"
}

export function closSockets(data)
{
    if (data.idInterval != -1)
    {
        clearInterval(data.idInterval);
        data.idInterval = -1;
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
