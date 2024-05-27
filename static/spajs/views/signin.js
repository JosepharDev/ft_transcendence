import { pushUrl } from "../utils/urlRoute.js";

export async function signin()
{
    app = document.getElementById("app");
    app.innerHTML = signInHtml();

    let formSingin = document.querySelector("#frm");
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

    let form = document.getElementById('frm');
    let formData = new FormData(form);
    const request = new Request(
        '/profile/signin/',
        {
            method: 'POST',
            body: formData,
        }
    );
    res = await fetch(request);
    js = await res.json();
    if (js.message === "Success")
    {
        pushUrl('/');
    }
}