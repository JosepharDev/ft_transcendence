import { translations } from "../utils/localization.js";
import { pushUrl } from "../utils/urlRoute.js";
import { dataGlobal, logout } from "./globalData.js";




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
                if (messageStatus.message === "2fa")
                    pushUrl('/twofa');
                else
                {
                    logout();
                    pushUrl('/signin');
                }
                return 
            }
            throw new Error('Error: /api/settings/');
        }


        let js = await res.json();
        let isEnable = translations[dataGlobal.selectedLanguage]['enable2fa'];
        let enableOrDisable = 'enable2fa';
        
        if (js.message)
        {
            isEnable = translations[dataGlobal.selectedLanguage]['disable2fa'];
            enableOrDisable = 'disable2fa';
        }
            

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
        <h2 class="settings-title" data-localize="profileSettings">${translations[dataGlobal.selectedLanguage]['profileSettings']}</h2>
        <form id="profile-form" enctype="multipart/form-data">
            <div class="form-group">
                <label id="upload-label" for="profile-image" data-localize="uploadAvatar">${translations[dataGlobal.selectedLanguage]['uploadAvatar']}</label>
                <input type="file" class="form-control-file" id="profile-image" accept="image/*">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="username" data-localize="enterUsername" placeholder="${translations[dataGlobal.selectedLanguage]['enterUsername']}">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="nickname" data-localize="enterNickname" placeholder="${translations[dataGlobal.selectedLanguage]['enterNickname']}">
            </div>
            <button id="updateProfile" type="submit" class="btn btn-primary btn-block" data-localize="updateProfile">${translations[dataGlobal.selectedLanguage]['updateProfile']}</button>
        </form>
            <p id="error-msg-update"><p>

        <div class="two-factor-auth">
            <button id="toggle-2fa-btn" class="btn btn-secondary btn-block" data-localize="${datalocalise}">${isEnable}</button>
            <img id="2fa-image" src="" alt="2FA QR Code" style="display: none;">
            <input type="text" id="twofa-code" class="form-control mt-2" data-localize="enterOtp" placeholder="${translations[dataGlobal.selectedLanguage]['enterOtp']}" style="display: none;">
            <button id="submit-2fa-btn" class="btn btn-success btn-block mt-2" style="display: none;" data-localize="submitOtp">${translations[dataGlobal.selectedLanguage]['submitOtp']}</button>
        </div>
            <p id="error-msg-twofa"><p>

    </div>
    `)
}


async function profileFormSettingsEvent(e)
{
    e.preventDefault();
    try
    {
        const isupdated = document.getElementById('error-msg-update');
        const username = document.getElementById('username').value;
        const nickname = document.getElementById('nickname').value;
        const profileImage = document.getElementById('profile-image').files[0];
        const formData = new FormData();
        if (username.length > 0)
            formData.append('username', username);    
        
        if (nickname.length > 0)
                formData.append('nickname', nickname);
        
        if (profileImage)
            formData.append('avatar', profileImage);
    
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
                if (messageStatus.message === "2fa")
                    pushUrl('/twofa');
                else
                {
                    logout();
                    pushUrl('/signin');
                }
                return 
            }
            isupdated.textContent = 'Not valid input';
            isupdated.style.color = '#dc3545';
        }
        else
        {
            let messageStatus = await res.json();
            if (messageStatus.message === "success")
            {
                isupdated.textContent = 'updated succesfully';
                isupdated.style.color = '#5dbea3';
                document.getElementById('avatarProfile').src = messageStatus.avatar;
            }
            else
            {
                isupdated.textContent = messageStatus.message;
                isupdated.style.color = '#dc3545';
            }
        }
    }
    catch (err)
    {
        pushUrl('/');
    }
}



async function twofaButtonEvent(e)
{
    e.preventDefault();

    try
    {
        const image = document.getElementById('2fa-image');
        const input = document.getElementById('twofa-code');
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
            if (res.status === 401)
            {
                let messageStatus = await res.json();
                if (messageStatus.message === "2fa")
                    pushUrl('/twofa');
                else
                {
                    logout();
                    pushUrl('/signin');
                }
                return 
            }

        }
    }
    catch (err)
    {
        pushUrl('/');
    }
}

async function submit2faButtonEvent(e)
{
    
    try
    {
        const code = document.getElementById('twofa-code').value;
        const isoptok = document.getElementById('error-msg-twofa');
    
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
        let res = await fetch(request);
        
        if (res.ok)
        {
            let js = await res.json();
            if (js.message === "success")
            {
                const image = document.getElementById('2fa-image');
                const input = document.getElementById('twofa-code');
                const button = document.getElementById('toggle-2fa-btn');
                const submitButton = document.getElementById('submit-2fa-btn');
    
                button.textContent = translations[dataGlobal.selectedLanguage]['disable2fa'];
                button.setAttribute('data-localize', 'disable2fa');
                image.style.display = 'none';
                input.style.display = 'none';
                submitButton.style.display = 'none';
                isoptok.textContent = "";
            }
            else
            {
                isoptok.textContent = js.message;
            }
        }
        else
        {
            if (res.status === 401)
            {
                let messageStatus = await res.json();
                if (messageStatus.message === "2fa")
                    pushUrl('/twofa');
                else
                {
                    logout();
                    pushUrl('/signin');
                }
                return 
            }
            else
            {
                isoptok.textContent = "Wrong Code";
            }
        }
    }
    catch (err)
    {
        const isoptok = document.getElementById('error-msg-twofa');
        isoptok.textContent = "Wrong Code";
    }
}