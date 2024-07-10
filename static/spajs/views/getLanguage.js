export async function getLanguage()
{
    try
    {
        const req = new Request(
            '/api/update/language/',
            {
                method: 'GET',
            }
        );
        
        let res = await fetch(req);
        
        if (!res.ok)
        {
            return {message : 'ERROR'};
        }

        let js = await res.json();
        return js;
    }
    catch (error)
    {
        return {message : 'ERROR'} ;
    }
}
