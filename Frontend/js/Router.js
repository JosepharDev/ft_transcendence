const Router = {
    init: () => {
        window.addEventListener("popstate", (event) => {
            Router.go(event.state.route, false)
        })
        Router.go(location.pathname);
    },
    go: (route, addToHistory=true) => {
        console.log(`Going to ${route}`);

        if (addToHistory && location.pathname != route) {
            console.log("hello")
            history.pushState({ route }, '', route)
        }

        let pageElement = null;
        pageElement = document.createElement("profile-page");
/*
        switch (route) {
            // add this just test
            // case "/":
            //     break;
            ///////////////////
            case "/":
            case "/home":
                pageElement = document.createElement("home-page");
                break;
            case "/login":
                pageElement = document.createElement("login-page");
                break;
            case "/profile":
                pageElement = document.createElement("profile-page");
                break;
            case "/settings":
                pageElement = document.createElement("settings-page");
                break;
            case "/search":
                pageElement = document.createElement("search-page");
                break;
            // default:
            //     pageElement = document.createElement("h1");
            //     pageElement.textContent = "Orilli yat sa3ta"
            //     break;
        }
        pageElement = document.createElement("profile-page");
*/

        if (pageElement)
        {
            document.getElementById("root").innerHTML = ""
            if (/^(\/home|\/settings|\/profile|\/search)$/.test(route)) {
                let navbar_element = document.createElement("nav-bar");
                document.getElementById("root").appendChild(navbar_element)
            }
            document.getElementById("root").appendChild(pageElement)
            window.scrollTo(0, 0);
            // console.log("hello")
        }
   }
}

export default Router