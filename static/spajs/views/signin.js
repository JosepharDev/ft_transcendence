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
            <span>Don't have an account? </span> <a id="sup" href="/signup">Sign Up</a>
            <p id="error-msg"><p>
    </div>
</div>
    `

    let formSingin = document.querySelector("#signinForm");
    formSingin.addEventListener("submit", submitSigninEvent)

    document.getElementById("sup").addEventListener('click', async (e)=>{
        e.preventDefault();
        pushUrl('/signup');
    })
    
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

    try
    {

        let res = await fetch(request);
    
        if (!res.ok)
        {
            if (res.status === 401)
            {
                let js = await res.json();
                
                if (js.message !== '2fa')
                {
                    document.getElementById('error-msg').textContent = js.message;
                    return ;
                }
                else if (js.message === "2fa")
                {
                    pushUrl('/twofa');
                    return ;
                }
            }
        }
            
            
        console.log('ffffffffffffffffff');
        let js = await res.json();
        console.log(js.message);

    
    
        document.getElementById('error-msg').textContent = '';
        if (js.message === "success")
        {
            document.querySelector("#navi").classList.remove("hideme");
            sendOnline();
            document.getElementById('avatarProfile').src = js.avatar;
            document.getElementById("language-selector").value = js.language;
            dataGlobal.selectedLanguage = js.language;
            console.log(js.avatar);
            pushUrl('/home');
        }

    }
    catch (err)
    {
        document.getElementById('error-msg').textContent = 'Error! Try again';
    }
}