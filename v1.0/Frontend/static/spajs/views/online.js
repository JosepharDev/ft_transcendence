import { dataGlobal } from "./globalData.js";
export function sendOnline()
{
    try
    {
        if (dataGlobal.sentOnline)
            return ;
        // console.log("SENDONLINE");
        dataGlobal.socketOnline = new WebSocket(
            'wss://'
            + window.location.host
            + '/ws/onlineUser/'
            + '3'
            + '/'
        );

        dataGlobal.socketOnline.onclose = (event) => {
            dataGlobal.sentOnline = false;
            dataGlobal.socketOnline = -1;
          };
        
        dataGlobal.sentOnline = true;
    }
    catch (err)
    {
        dataGlobal.sentOnline = false;
        dataGlobal.socketOnline = -1;
    }

}