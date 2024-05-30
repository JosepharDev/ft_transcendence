import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal } from "./globalData.js";
import { sendOnline } from "./online.js";

export async function signin()
{   console.log("AYOOaaa");
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
                <input type="text" class="form-control" id="username" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password">
            </div>
            <button id="mybtn" type="submit" class="btn btn-primary btn-block">Sign In</button>
            </form>
            <form action="api/signin/auth_42_api/" id="fortysign" method="POST">\
            <button type="submit" class="btn btn-ftwo btn-block" >Sign in with 42</button>
            </form>
    </div>
</div>
    `

    // app.innerHTML = signInHtml();

    let formSingin = document.querySelector("#signinForm");
    formSingin.addEventListener("submit", submitSigninEvent)
}


function signInHtml()
{
    return (`
    '<h1> signin </h1>\
        <form id="frm" action="" method="POST">\
            <input type="text" name="username" placeholder="Username" ><br />\
            <input type="password" name="password" placeholder="Password"><br/>\
            <button type="submit">Login</button>\
        </form>\
        <form action="profile/signin/auth_42_api/" method="POST">\
        <button type="submit">Authenticate with 42 API</button>\
    </form>'
    `)
}


async function submitSigninEvent(e)
{
    e.preventDefault();

    let form = document.getElementById('signinForm');
    // let formData = new FormData(form);
   
    
    const username = document.getElementById('username').value;
    const profileImage = document.getElementById('password').value;
    const formData = new FormData();
    // if (username.length > 0)
        formData.append('username', username);
    // if (profileImage) {
        formData.append('password', profileImage);
    // }

    const request = new Request(
        '/api/signin/',
        {
            method: 'POST',
            body: formData,
        }
    );

    let res = await fetch(request);
    console.log("WWWWWW")
    let js = await res.json();
    if (js.message === "Success")
    {
        //use something other than hideme to get the element
        console.log("YOYO")
        document.querySelector(".hideme").classList.remove("hideme");
        
        sendOnline();
        pushUrl('/');
    }
    else if (js.message === "2fa")
    {
        pushUrl('/twofa');
    }
}