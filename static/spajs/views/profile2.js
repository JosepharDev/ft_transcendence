import { pushUrl } from "../utils/urlRoute.js";
import { translations } from "../utils/localization.js";
import { dataGlobal } from "./globalData.js";



export async function profileFriend2(id, is_me)
{
    let app = document.getElementById("app");
    app.innerHTML = profileFriendHtml();

    try
    {

        let jj = `/api/userid/${id}/`;
        if (is_me)
            jj = `/api/profile/`;

        const request = new Request(
            jj,
            {
                method: 'GET',
            }
        );
        
        const response = await fetch(request);

        if (!response.ok)
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
            throw new Error('Error: /api/userid/');
        }
        

        const userData = await response.json();

        document.getElementById("firstPartData").innerHTML = profileFirstPart(userData);
        document.querySelector("#statsPart").innerHTML = profileStatsPart(userData);
        historyMatchView(userData.matches);
        friendsView(userData.friends);
        if (!userData.its_me)
        {
            async function toggleFollow(userId, btn)
            {
                let formData = new FormData();
                formData.append('data', btn.textContent);
                try
                {
                    const response = await fetch(`/api/friends/${userId}/`, {
                        method: 'POST',
                        body: formData,
                    });


                    if (!response.ok)
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


                    let js = await response.json()

                    if (js.message === "Friend removed successfully")
                        btn.textContent = translations[dataGlobal.selectedLanguage]['follow'];

                    else if (js.message === "Friend added successfully")
                        btn.textContent = translations[dataGlobal.selectedLanguage]['unfollow'];

                }
                catch (err)
                {
                    alert('Something went wrong!');
                }
            }

            let flwbtn = document.querySelector(".follow-btn");
            flwbtn.addEventListener('click', () =>{
                toggleFollow(userData.id, flwbtn);
            })
        }
    }
    catch (err)
    {
        alert('Something went wrong!');
        pushUrl('/');
    }
}



function profileFriendHtml()
{
    return (`
    <div class="container mt-5">
    <div class="card user-profile mx-auto">
        <div class="card-header text-white">
            <div class="d-flex align-items-center" id="firstPartData">
            </div>
        </div>
        <div class="card-body">
            <div class="stats d-flex justify-content-around" id="statsPart">

                <!-- stats part -->
            
            </div>
            <h5 class="mt-4" data-localize="matchHistory">${translations[dataGlobal.selectedLanguage]['matchHistory']}</h5>
            <div class="match-history" id="matchHis" >
                

            </div>
            <h5 class="mt-4" data-localize="followng">${translations[dataGlobal.selectedLanguage]['followng']}</h5>
            <div class="match-history allFriends">


            </div>
        </div>
    </div>
</div>
    `);
}


function profileFirstPart(data)
{

    let followShow = "";
    let onlineStatus = data.is_online ? translations[dataGlobal.selectedLanguage]['online'] : translations[dataGlobal.selectedLanguage]['offline'];
    let dataonlineSatus = data.is_online ? 'online' : 'offline';
    
    let statusIndicator = data.is_online ? "" : "offline";

    if (!data.its_me)
    {
        let followPlace = "";
        let datalocal = "";
        if (data.friend)
        {
            followPlace = translations[dataGlobal.selectedLanguage]['unfollow'];
            datalocal = 'unfollow';
        }    
        else
        {
            followPlace = translations[dataGlobal.selectedLanguage]['follow'];
            datalocal = 'follow';
        }
        followShow = `<button class="btn btn-sm btn-outline-light follow-btn" data-localize="${datalocal}">${followPlace}</button>`;
    }

    return (`
    <img src="${data.avatar}" class="profile-avatar" alt="User Avatar">
    <div class="ml-3">
        <h4 class="username mb-0">${data.username}</h4>
        <div class="d-flex align-items-center mt-2">
            ${followShow}
            <span class="status-indicator ${statusIndicator} ml-3"></span>
            <span class="status-text ml-2" data-localize="${dataonlineSatus}">${onlineStatus}</span>
        </div>
    </div>
    `)
}

function profileStatsPart(data)
{
    return (`
        <div class="stat">
            <h5 data-localize="wins">${translations[dataGlobal.selectedLanguage]['wins']}</h5>
            <p>${data.wins}</p>
        </div>
        <div class="stat">
            <h5 data-localize="loses">${translations[dataGlobal.selectedLanguage]['loses']}</h5>
            <p>${data.loses}</p>
        </div>
        <div class="stat">
            <h5 data-localize="tournamentwins">${translations[dataGlobal.selectedLanguage]['tournamentwins']}</h5>
            <p>${data.tournament_wins}</p>
        </div>
    `)
}

function historyMatchView(data)
{
    let matches = document.querySelector("#matchHis");
    if (data.length > 0)
    {
        data.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.innerHTML = historyMatchHelper(element);
                
                matches.appendChild(newDiv);
        });
    }
}

function historyMatchHelper(data)
{
    return (`
    <div class="match d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center flex-grow-1">
            <img src="${data.plr1img}" class="player-avatar" alt="Player 1">
            <span class="player-name ml-2">${data.player1Username}</span>
            <span class="match-score ml-2">${data.player1Score}</span>
        </div>
        <span class="vs">vs</span>
        <div class="d-flex align-items-center flex-grow-1 justify-content-end">
            <span class="match-score mr-2">${data.player2Score}</span>
            <span class="player-name mr-2">${data.player2Username}</span>
            <img src="${data.plr2img}" class="player-avatar" alt="Player 2">
        </div>
        <span class="match-date ml-3">2023-05-01</span>
    </div>
    `)
}




function friendsView(data)
{
    let matches = document.querySelector(".allFriends");
    if (data.length > 0)
    {
        data.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.innerHTML = friendData(element);
                
                matches.appendChild(newDiv);
                
                let frlink = document.getElementById(`userlink${element.id}`);
                frlink.addEventListener('click', (e)=>{
                e.preventDefault();
                pushUrl(`/userid/${element.id}`);
            })
        });
    }
}

function friendData(data)
{
    // <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    return (
        `
            <a id="userlink${data.id}" href="/userid/${data.id}" class="friend d-flex align-items-center mt-2 text-decoration-none">
                <img src="${data.avatar}" class="friend-avatar mr-3" alt="${data.username}">
                <span class="friend-name">${data.username}</span>
            </a>
            `
        )
    // </div>

}

