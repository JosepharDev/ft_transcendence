import { dataGlobal } from "./globalData.js";
export function sendOnline()
{
    if (dataGlobal.sentOnline)
        return ;
    console.log("SENDONLINE");
    dataGlobal.socketOnline = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/onlineUser/'
        + '3'
        + '/'
    );
    dataGlobal.sentOnline = true;

}