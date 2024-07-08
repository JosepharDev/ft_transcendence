import { dataGlobal } from "./globalData.js";
export function sendOnline()
{
    if (dataGlobal.sentOnline)
        return ;
    console.log("SENDONLINE");
    const chatSocket = new WebSocket(
        'wss://'
        + window.location.host
        + '/ws/onlineUser/'
        + '3'
        + '/'
    );
    dataGlobal.sentOnline = true;

}