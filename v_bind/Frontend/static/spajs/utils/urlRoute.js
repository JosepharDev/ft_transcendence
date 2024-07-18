export function urlRoute (event)
{
    event = event || window.event;

    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    deleteEvent = [];
    urlLocationHandler();
}

export function pushUrl (href)
{
    console.log(`morioaaaaaaa`);
    try
    {
        console.log(`-> ${href}   ${window.location.pathname}`);
        if (href === window.location.pathname)
            return ;


        if (history.state && history.state.href === href) {
            history.replaceState({ href }, '', href);
        } else {
            history.pushState({ href }, '', href);
        }
        console.log('-> ${href}   ${window.location.pathname}')
        console.log(window.location.pathname)
        
        // history.pushState({}, '', href);

        
        window.dispatchEvent(new Event('popstate'));
    }
    catch (err)
    {
        console.log("BAL");
    }
}
