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
        switch (route) {
            // add this just test
            case "/":
                break;
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
            default:
                pageElement = document.createElement("h1");
                pageElement.textContent = "Orilli yat sa3ta"
                break;
        }
        if (pageElement) {
            document.getElementById("root").innerHTML = ""
            document.getElementById("root").appendChild(pageElement)
            window.scrollTo(0, 0);
        }
   }
}

export default Router