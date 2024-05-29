import { sendOnline } from "./online.js";
import { pushUrl } from "../utils/urlRoute.js";
export async function twofaView()
{
    app = document.getElementById("app");
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
            </form>
        </div>
    </div>
    `;
    document.getElementById('signinForm').addEventListener('submit', submitOTPButtonEvent);
}


async function submitOTPButtonEvent(e)
{
    e.preventDefault();
    const code = document.querySelector('.otpcode').value;
    let formData = new FormData();
    formData.append('code', code);

    const request = new Request(
        '/profile/signin/twofa/',
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
            alert("false otp");
        }
    }
    catch (err)
    {
        alert("otp ERROR");

    }


}