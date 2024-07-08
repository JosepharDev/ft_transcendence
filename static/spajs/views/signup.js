import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal } from "./globalData.js";
import { sendOnline } from "./online.js";

export async function signup()
{
    document.querySelector("#navi").classList.add("hideme");
    
    let app = document.getElementById("app");
    app.innerHTML = `
        <div class="signin">
            <div class="form-container">
                <div class="form-header">
                    <h2>Sign Up</h2>
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
                        <button id="mybtn" type="submit" class="btn btn-primary btn-block">Sign Up</button>
                    </form>
                    <span>Already have an account? </span> <a id="sup" href="/signin">Sign In</a>
                    <p id="error-msg"><p>
            </div>
        </div>
    `

    let formSingin = document.querySelector("#signinForm");
    formSingin.addEventListener("submit", submitSigninEvent)

    document.getElementById("sup").addEventListener('click', async (e)=>{
        e.preventDefault();
        pushUrl('/signin');
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

    try
    {
        const request = new Request(
            '/api/signup/',
            {
                method: 'POST',
                body: formData,
            }
        );
    
        let res = await fetch(request);
    
        if (!res.ok)
        {
            if (res.status === 401)
            {
                let js = await res.json();
                document.getElementById('error-msg').textContent = js.message;
                return ;
            }
        }

        let js = await res.json();

        if (js.message === "success")
        {
            pushUrl('/signin');
        }
    }
    catch (err)
    {
        document.getElementById('error-msg').textContent = 'Error! Try again';
    }
}