import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal } from "./globalData.js";
import { sendOnline } from "./online.js";

export async function signin()
{
    document.querySelector("#navi").classList.add("hideme");
    
    let app = document.getElementById("app");
    app.innerHTML = `
    <div class="signin">
    <div class="form-container">
        <div class="form-header">
            <h2>Sign In</h2>
        </div>
        <form id="signinForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" placeholder="Enter username" autocomplete="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password" autocomplete="current-password">
            </div>
            <button id="mybtn" type="submit" class="btn btn-primary btn-block">Sign In</button>
            </form>
            <form action="api/signin/auth_42_api/" id="fortysign" method="POST">\
            <button type="submit" class="btn btn-ftwo btn-block" >Sign in with 42</button>
            </form>
    </div>
</div>
    `

    let formSingin = document.querySelector("#signinForm");
    formSingin.addEventListener("submit", submitSigninEvent)
}



async function submitSigninEvent(e)
{
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    const request = new Request(
        '/api/signin/',
        {
            method: 'POST',
            body: formData,
        }
    );

    let res = await fetch(request);




    let js = await res.json();




    if (js.message === "success")
    {
        document.querySelector("#navi").classList.remove("hideme");
        
        sendOnline();
        pushUrl('/');
    }
    else if (js.message === "2fa")
    {
        pushUrl('/twofa');
    }
}