import { sendOnline } from "./online.js";
import { pushUrl } from "../utils/urlRoute.js";
export async function twofaView()
{
    let app = document.getElementById("app");
    app.innerHTML = `
    <div class="signin">
        <div class="form-container">
            <div class="form-header">
                <h2>OTP</h2>
            </div>
            <form id="signinForm">
                <div class="form-group">
                    <label for="username">otp</label>
                    <input type="text" class="form-control otpcode" id="username"  placeholder="Enter otp code">
                </div>
                <button id="mybtn" type="submit" class="btn btn-primary btn-block">Submit</button>
                <button id="logoutbtn" type="button" class="btn btn-primary btn-block">Logout</button>
            </form>
            <p id="error-msg"><p>
        </div>
    </div>
    `;
    document.getElementById('signinForm').addEventListener('submit', submitOTPButtonEvent);
    document.getElementById('logoutbtn').addEventListener('click', async () =>
    {
        console.log('yo');
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
                pushUrl('/signin');
            }
            console.log('y89998o');
        }
        catch (err)
        {
            console.log('y88o');
        }
    });
}


async function submitOTPButtonEvent(e)
{
    e.preventDefault();
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


    try
    {
        let res = await fetch(request);
        if (!res.ok)
        {
            console.log("resd not ok");
        }
        let js = await res.json();
        console.log("res ok");
        console.log(js);
        if (js.message === "success")
        {
            document.querySelector(".hideme").classList.remove("hideme");

            console.log("reaaaas ok");
            sendOnline();
            console.log("reaaagsdgsdgdsas ok");
            pushUrl('/');
        }
        else
        {
            document.getElementById('error-msg').textContent = 'Invalid OTP Code';
        }
    }
    catch (err)
    {
        document.getElementById('error-msg').textContent = 'Invalid OTP Code';
    }


}