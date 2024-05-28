
export function sendOnline()
{
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/onlineUser/'
        + '3'
        + '/'
    );
}