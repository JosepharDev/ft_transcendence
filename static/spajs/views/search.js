import {pushUrl} from "./../utils/urlRoute.js"

export function searchView ()
{
    console.log("lolo")
    let app = document.getElementById("app");
    app.innerHTML = searchHtml();
    let searchButton = document.getElementById("search-form");
    searchButton.addEventListener('submit', searchElementsEvent);
}


function searchHtml()
{
    return (`
            <div class="container search-container">
            <h2>User Search</h2>
            <form id="search-form">
                <div class="form-group">
                    <input name="q" type="text" class="form-control" id="search-input" placeholder="Search for users by username">
                </div>
                <button id="mybtn" type="submit" class="btn-search btn btn-primary btn-block">Search</button>
            </form>
            <div id="search-results" class="search-results"></div>
        </div>
    `)
}


async function searchElementsEvent(e)
{
    console.log("jijiji")
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
        let js = await res.json();
        const filteredUsers = js;
    
        if (filteredUsers.length > 0) {
            filteredUsers.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
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
            resultsContainer.innerHTML = '<div class="not-found">No users found</div>';
        }
    }
    catch (error)
    {
        resultsContainer.innerHTML = '<div class="not-found">No users found</div>';
        return ;
    }
}

