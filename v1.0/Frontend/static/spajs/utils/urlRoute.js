
export function pushUrl (href)
{
    try
    {
        if (href === window.location.pathname)
            return ;


        if (history.state && history.state.href === href) {
            history.replaceState({ href }, '', href);
        } else {
            history.pushState({ href }, '', href);
        }
        
        window.dispatchEvent(new Event('popstate'));
    }
    catch (err)
    {
    }
}
