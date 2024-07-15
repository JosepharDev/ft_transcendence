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
    try
    {
        if (href === window.location.pathname)
            return ;
        console.log(`-> ${href}   ${window.location.pathname}`)


        if (history.state && history.state.href === href) {
            history.replaceState({ href }, '', href);
        } else {
            history.pushState({ href }, '', href);
        }
        
        // history.pushState({}, '', href);

        
        window.dispatchEvent(new Event('popstate'));
    }
    catch (err)
    {
        console.log("BAL");
    }
}
