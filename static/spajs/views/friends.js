
import { pushUrl } from "../utils/urlRoute.js";

export async function friendsView()
{
    const request = new Request(
        '/api/friends/',
        {
            method: 'GET',
        }
    );
    let res = await fetch(request);
    let js = await res.json();


    let app = document.getElementById("app");
    app.innerHTML = friendsHtml();

    const userListElement = document.querySelector('.friends-list');
    userListElement.innerHTML = '';

    if (!js.length)
    {
        return;
    }

    js.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
        userElement.innerHTML = friendData(user);
        userListElement.appendChild(userElement);

        let frlink = document.getElementById(`userlink${user.id}`);
        frlink.addEventListener('click', (e)=>{
            e.preventDefault();
            pushUrl(`/userid/${user.id}`);
        })
    });
}


function friendsHtml()
{
    return (`
    <div class="container mt-5">
        <h3 class="text-white">Friends List</h3>
        <div class="row friends-list">
        
        <!-- Repeat for more friends -->
        </div>
        </div>
        `)
}


function friendData(data)
{
    // <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    return (
        `
            <a id="userlink${data.id}" href="/userid/${data.id}" class="friend d-flex align-items-center text-decoration-none">
                <img src="${data.avatar}" class="friend-avatar mr-3" alt="${data.username}">
                <span class="friend-name">${data.username}</span>
            </a>
            `
        )
    // </div>

}