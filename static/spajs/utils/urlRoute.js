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
    history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
}
