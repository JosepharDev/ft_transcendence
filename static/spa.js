const urlRoutes = {
    404: {
        template : "404.html",
        title : "",
        description: "" 
    },

    '/' : {
        template : "/profile",
        title : "",
        description: "",
        exec : ()=>{
            document.addEventListener('keydown', handleKeyDown);
            deleteEvent.push ({'elem' : document, 'evnt': 'keydown', 'fun': handleKeyDown });
        }
    },
/*
<form>
  <div>
    <input type="search" id="mySearch" name="q" />
    <button>Search</button>
  </div>
</form>

*/



    '/search' : {
        template : "/profile",
        title : "",
        description: "",
        exec : () => {


            async function example(e)
            {
                e.preventDefault();
                console.log("signin");
                // const formData = new FormData(form);
                // const queryString = new URLSearchParams(formData).toString();
                var form = document.getElementById('frm');
                var formData = new FormData(form);
                const request = new Request(
                    'http://127.0.0.1:8000/profile/search/?' + new URLSearchParams(formData).toString(),
                    {
                        method: 'GET',
                        mode: 'same-origin', // Do not send CSRF token to another domain.
                    }
                );
                res = await fetch(request);
                js = await res.json();
                console.log(js);

            }


            
            document.getElementById("content").innerHTML = '<h1> signin </h1>\
            <form id="frm" action="" method="POST">\
                <div>\
                <input type="search" id="mySearch" name="q" />\
                <button type="submit">Search</button>\
                </div>\
            </form>';
            d = document.querySelector("#frm");

            d.addEventListener("submit" , example)

            deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });
        }
    },

    '/signin' : {
        template : "/profile",
        title : "",
        description: "",
        html:     '<h1> signin </h1>\
                <form id="frm" action="" method="POST">\
                    <input type="text" name="username" placeholder="Username" ><br />\
                    <input type="password" name="password" placeholder="Password"><br/>\
                    <button type="submit">Login</button>\
                    <p> Not registered? <a href="/signup" class=""> Create a account </a></p>\
                </form>'
        ,
        exec : async ()=> {

            async function example(e)
            {
                e.preventDefault();
                console.log("signin");

                var form = document.getElementById('frm');
                var formData = new FormData(form);
                const request = new Request(
                    'http://127.0.0.1:8000/profile/signin/',
                    {
                        method: 'POST',

                        mode: 'same-origin', // Do not send CSRF token to another domain.
                        body: formData,
                    }
                );
                res = await fetch(request);
                js = await res.json();
                console.log(js);
                if (js.message === "Success")
                {

                    const request = new Request(
                        'http://127.0.0.1:8000/profile/signin/',
                        {
                            method: 'GET',
    
                            mode: 'same-origin', // Do not send CSRF token to another domain.
                        }
                    );
                    res = await fetch(request);
                    js = await res.json();
                    console.log(js);
                    document.getElementById("content").innerHTML = `<img src="/media/blank-profile-picture.png">\
                        </img>` ;
                    // pushUrl("/");
                }

            }
            document.getElementById("content").innerHTML = '<h1> signin </h1>\
            <form id="frm" action="" method="POST">\
                <input type="text" name="username" placeholder="Username" ><br />\
                <input type="password" name="password" placeholder="Password"><br/>\
                <button type="submit">Login</button>\
                <p> Not registered? <a href="/signup" class=""> Create a account </a></p>\
            </form>';
            d = document.querySelector("#frm");

            const request = new Request(
                'http://127.0.0.1:8000/profile/signin/',
                {
                    method: 'GET',

                    mode: 'same-origin', // Do not send CSRF token to another domain.
                }
            );
            res = await fetch(request);
            js = await res.json();
            console.log(js);
            d.addEventListener("submit" , example)

            deleteEvent.push ({'elem' : d, 'evnt': 'submit', 'fun': example });

        }
    },
};

/*


*/
const pushUrl = (href) => {
    history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  };

deleteEvent = []

function handleKeyDown(e)
{
    console.log('kkkk');
}


document.addEventListener("click", (e) => {
    const {target} = e;
    if (!target.matches("nav a"))
        return;
    console.log('click event');
    e.preventDefault();
    urlRoute();
})


const urlRoute = (event) => {
    event = event || window.event;  // is this mandatory

    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    deleteEvent.forEach(element => {
        element.elem.removeEventListener(element.evnt, element.fun);
    });
    deleteEvent = [];
    urlLocationHandler();
}


const urlLocationHandler = async () => {
    const location = window.location.pathname;
    if (!location.length)
        location = "/";

    // console.log("bla");
    const route = urlRoutes[location] || urlRoutes[404];
    if (location === "/signin")
        route.exec();
    else if (location === "/search")
        route.exec();
    else
    {
    console.log("bla");

        urlRoutes['/'].exec();
        document.getElementById("content").innerHTML = "<p>example</p>";
    }
}


window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();

