import {pushUrl} from "./../utils/urlRoute.js"
import { translations } from "../utils/localization.js";
import { dataGlobal } from "./globalData.js";
export function searchView ()
{
    console.log("lolo")
    let app = document.getElementById("app");
    app.innerHTML = searchHtml();
    let searchButton = document.getElementById("search-form");
    let sear = document.getElementById("search-input");
    sear.addEventListener('input', searchElementsEvent);
    searchButton.addEventListener('submit', searchElementsEvent);
}

function searchHtml()
{
    return (`
            <div class="container search-container">
            <h2 data-localize="usersSearch">${translations[dataGlobal.selectedLanguage]['usersSearch']}</h2>
            <form id="search-form">
                <div class="form-group">
                    <input name="q" type="text" class="form-control" id="search-input" data-localize="usernameSearch" placeholder="${translations[dataGlobal.selectedLanguage]['usernameSearch']}">
                </div>
                <button id="mybtn" type="submit" class="btn-search btn btn-primary btn-block" data-localize="search">${translations[dataGlobal.selectedLanguage]['search']}</button>
            </form>
            <div id="search-results" class="search-results"></div>
        </div>
    `)
}


async function searchElementsEvent(e)
{
    e.preventDefault();
    var form = document.getElementById('search-form');
    var formData = new FormData(form);
    const request = new Request(
        '/api/search/?' + new URLSearchParams(formData).toString(),
        {
            method: 'GET',
        }
    );

    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    try
    {
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
            throw new Error('Error: /api/search/');
        }

        let js = await res.json();
        const filteredUsers = js;
    
        if (filteredUsers.length > 0) {
            filteredUsers.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
                if (user.username.length > 30)
                    user.username = user.username.substring(0, 27) + "...";
                
                userItem.innerHTML = `
                    <a id="userlink${user.id}" href="/userid/${user.id}">
                    <img src="${user.avatar}" alt="${user.username} Profile Image">
                    <span>${user.username}</span>
                    </a>
                `;
                resultsContainer.appendChild(userItem);
                document.getElementById(`userlink${user.id}`).addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log(`/userid/${user.id}`)
                    pushUrl(`/userid/${user.id}`);
                });
            });
        }
        else {
            resultsContainer.innerHTML = `<div class="not-found" data-localize="notfound">${translations[dataGlobal.selectedLanguage]['notFound']}</div>`;
        }
    }
    catch (error)
    {
        resultsContainer.innerHTML = `<div class="not-found" data-localize="notfound">${translations[dataGlobal.selectedLanguage]['notFound']}</div>`;
        return ;
    }
}

