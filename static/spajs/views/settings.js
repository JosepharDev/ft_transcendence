import { translations } from "../utils/localization.js";
import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal } from "./globalData.js";
export async function settingView()
{
    try
    {
        let app = document.getElementById("app");
        const request = new Request(
            '/api/istwofa/',
            {
                method: 'GET',
            }
        );
        let res = await fetch(request);

        if (!res.ok)
        {

            if (res.status === 401)
            {
                let messageStatus = await res.json();
                if (messageStatus === "2fa")
                    pushUrl('/twofa');
                else
                    pushUrl('/signin');
                return 
            }
            throw new Error('Error: /api/friends/');
        }


        let js = await res.json();
        let isEnable = translations[dataGlobal.selectedLanguage]['enable2fa'];
        let enableOrDisable = 'enable2fa';
        if (js.message)
            {
                isEnable = translations[dataGlobal.selectedLanguage]['disable2fa'];
                enableOrDisable = 'disable2fa';
            }
            
            console.log("AYPPPPPPPPPPPPPPPP")
            app.innerHTML = settingsHtml(isEnable, enableOrDisable);
        let profileFormSettings =  document.getElementById('profile-form');
        profileFormSettings.addEventListener('submit', profileFormSettingsEvent);
        let twofaButton = document.getElementById('toggle-2fa-btn');
        twofaButton.addEventListener('click', twofaButtonEvent);
        let submit2faButton = document.getElementById('submit-2fa-btn');
        submit2faButton.addEventListener('click', submit2faButtonEvent);
    }
    catch (err)
    {
        pushUrl('/');
    }
}


function settingsHtml(isEnable, datalocalise)
{
    return (`
    <div class="container settings-container">
        <h2 class="settings-title">Profile Settings</h2>
        <form id="profile-form" enctype="multipart/form-data">
            <div class="form-group">
                <label id="upload-label" for="profile-image" data-localize="uploadAvatar">${translations[dataGlobal.selectedLanguage]['uploadAvatar']}</label>
                <input type="file" class="form-control-file" id="profile-image">
            </div>
            <div class="form-group">
                <label for="username" data-localize="username">${translations[dataGlobal.selectedLanguage]['username']}</label>
                <input type="text" class="form-control" id="username" data-localize="enterUsername" placeholder="${translations[dataGlobal.selectedLanguage]['enterUsername']}">
            </div>
            <div class="form-group">
                <label for="nickname" data-localize="tournamentNickname">${translations[dataGlobal.selectedLanguage]['tournamentNickname']}</label>
                <input type="text" class="form-control" id="nickname" data-localize="enterNickname" placeholder="${translations[dataGlobal.selectedLanguage]['enterNickname']}">
            </div>
            <button id="mybtn" type="submit" class="btn btn-primary btn-block" data-localize="updateProfile">${translations[dataGlobal.selectedLanguage]['updateProfile']}</button>
        </form>
        <div class="two-factor-auth">
            <button id="toggle-2fa-btn" class="btn btn-secondary btn-block" data-localize="${datalocalise}">${isEnable}</button>
            <img id="2fa-image" src="" alt="2FA QR Code" style="display: none;">
            <input type="text" id="2fa-code" class="form-control mt-2" data-localize="enterOtp" placeholder="${translations[dataGlobal.selectedLanguage]['enterOtp']}" style="display: none;">
            <button id="submit-2fa-btn" class="btn btn-success btn-block mt-2" style="display: none;" data-localize="submitOtp">${translations[dataGlobal.selectedLanguage]['submitOtp']}</button>
        </div>
    </div>
    `)
}


async function profileFormSettingsEvent(e)
{
    e.preventDefault();
    const username = document.getElementById('username').value;
    const nickname = document.getElementById('nickname').value;
    const profileImage = document.getElementById('profile-image').files[0];
    const formData = new FormData();
    if (username.length > 0)
        formData.append('username', username);    
    if (nickname.length > 0)
            formData.append('nickname', nickname);
    if (profileImage) {
        formData.append('avatar', profileImage);
    }

    const request = new Request(
        '/api/update/',
        {
            method: 'PATCH',
            body: formData,
        }
    );


    let res = await fetch(request);

    if (!res.ok)
    {
        if (res.status === 401)
        {
            let messageStatus = await res.json();
            if (messageStatus === "2fa")
                pushUrl('/twofa');
            else
                pushUrl('/signin');
            return 
        }
        alert ("not updated");
    }
    else
        alert ("updated");
}



async function twofaButtonEvent(e)
{
    e.preventDefault();

    const image = document.getElementById('2fa-image');
    const input = document.getElementById('2fa-code');
    const button = document.getElementById('toggle-2fa-btn');
    const submitButton = document.getElementById('submit-2fa-btn');


    let formData = new FormData();
    
    if (button.textContent === "Disable 2FA" || button.textContent === "Desactivar 2FA" || 
        button.textContent === "Désactiver 2FA"
    )
        formData.append('qrcode', "disable");
    else
        formData.append('qrcode', "enable");

    const response = await fetch(`/api/signin/twofa_process/`, {
        method: 'POST',
        body: formData,
    });
    console.log("i did fetch");
    if (response.ok)
    {
        if (button.textContent === "Enable 2FA" ||
            button.textContent === "Activer 2FA" ||
            button.textContent === "Activar 2FA"
        )
        {
            if (image.style.display === 'none')
            {
                // Enable 2FA
                let blob = await response.blob();
                image.src = URL.createObjectURL(blob);
                image.style.display = 'block';
                input.style.display = 'block';
                submitButton.style.display = 'block';
                button.textContent = translations[dataGlobal.selectedLanguage]['disable2fa'];
                button.setAttribute('data-localize', 'disable2fa');
            }
        }
        else {
            // Disable 2FA
            image.style.display = 'none';
            input.style.display = 'none';
            submitButton.style.display = 'none';
            button.textContent = translations[dataGlobal.selectedLanguage]['enable2fa'];
            button.setAttribute('data-localize', 'enable2fa');
        }

    }
    else
    {
        let js = await response.json();
        console.log(js.message)
        console.log("notok");
    }
}

async function submit2faButtonEvent(e)
{
    const code = document.getElementById('2fa-code').value;
    e.preventDefault();
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
        
        console.log("resd ok");
        let js = await res.json();
        console.log(js);
        if (js.message === "success")
        {
            const image = document.getElementById('2fa-image');
            const input = document.getElementById('2fa-code');
            const button = document.getElementById('toggle-2fa-btn');
            const submitButton = document.getElementById('submit-2fa-btn');


            button.textContent = translations[dataGlobal.selectedLanguage]['disable2fa'];
            button.setAttribute('data-localize', 'disable2fa');
            image.style.display = 'none';
            input.style.display = 'none';
            submitButton.style.display = 'none';
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