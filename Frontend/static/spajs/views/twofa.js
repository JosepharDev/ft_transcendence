import { sendOnline } from "./online.js";
import { pushUrl } from "../utils/urlRoute.js";


export async function twofaView()
{
try
{
    const nav = document.getElementById("navi")
    if (!nav.classList.contains('hideme'))
        nav.classList.add("hideme");

    let app = document.getElementById("app");
    app.innerHTML = `
    <div class="signin">
        <div class="form-container">
            <div class="form-header">
                <h2>OTP</h2>
            </div>
            <form id="signinForm">
                <div class="form-group">
                    <input type="text" class="form-control otpcode" id="username"  placeholder="Enter otp code">
                </div>
                <button id="mybtntwofa" type="submit" class="btn btn-primary btn-block">Submit</button>
                <button id="logoutbtn" type="button" class="btn btn-primary btn-block">Logout</button>
            </form>
            <p id="error-msg"><p>
        </div>
    </div>
    `;
    document.getElementById('signinForm').addEventListener('submit', submitOTPButtonEvent);
    document.getElementById('logoutbtn').addEventListener('click', async () =>
    {
        try
        {
            const request = new Request(
                '/api/logout/',
                {
                    method: 'GET',
                }
            );
            let res = await fetch(request);
            let js = await res.json();
            if (js.message === "success")
            {
                if (window.location.pathname !== "/signin")
                    pushUrl('/signin');
                else
                    pushUrl('/signinn');
            }
        }
        catch (err)
        {
        }
    });
}
catch(err)
{

}
}


async function submitOTPButtonEvent(e)
{
    e.preventDefault();
    try
    {
        const code = document.querySelector('.otpcode').value;
        let formData = new FormData();
        formData.append('code', code);

        const request = new Request(
            '/api/signin/twofa/',
            {
                method: 'POST',
                body: formData,
            }
        );

        let res = await fetch(request);
        if (!res.ok)
        {
            document.getElementById('error-msg').textContent = 'Invalid OTP Code';
        }
        else
        {
            let js = await res.json();
    
            if (js.message === "success")
            {
                const navi = document.getElementById("navi");
                if (navi.classList.contains('hideme'))
                    navi.classList.remove("hideme");
                sendOnline();
                if (window.location.pathname !== "/")
                    pushUrl('/');
                else
                    pushUrl('/home');
            }
            else
            {
                document.getElementById('error-msg').textContent = js.message;
            }

        }
    }
    catch (err)
    {
        document.getElementById('error-msg').textContent = 'Invalid OTP Code';
    }


}