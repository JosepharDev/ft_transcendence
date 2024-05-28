

export async function profileFriend2(id)
{
    let app = document.getElementById("app");
    app.innerHTML = profileFriendHtml();

    try{

        let jj = `/profile/userid/${id}/`;
        const request = new Request(
            jj,
            {
                method: 'GET',
            }
        );
        const response = await fetch(request);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        document.getElementById("firstPartData").innerHTML = profileFirstPart(userData);
        console.log(userData.avatar);
        document.querySelector("#statsPart").innerHTML = profileStatsPart(userData);
        historyMatchView(userData.matches);

        if (!userData.its_me)
        {
            async function toggleFollow(userId, btn)
            {
                let formData = new FormData();
                formData.append('data', btn.textContent);
                try
                {
                    const response = await fetch(`/profile/friends/${userId}/`, {
                        method: 'POST',
                        body: formData,
                    });
                    
                    if (response.ok) {
                        let js = await response.json()
                        if (js.message === "Friend removed successfully")
                        {
                            btn.textContent = "Follow";
                            console.log(`FF${js.message}`);

                        }
                        else if (js.message === "Friend added successfully")
                        {
                            btn.textContent = "Unfollow";
                            console.log(js.message);
                        }
                        console.log(btn);
                    } else {
                        alert('Something went wrong!');
                    }
                }
                catch (err)
                {
            
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
        // document.querySelector(".profile-section").innerHTML = 
        // '<div class="username-display">Error loading user profile</div>';
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
            <h5 class="mt-4">Match History</h5>
            <div class="match-history" id="matchHis" >
                

            </div>
        </div>
    </div>
</div>
    `);
}


function profileFirstPart(data)
{
    console.log(data.its_me);
    console.log(data.friend);
    let followShow = "";
    let onlineStatus = data.is_online ? "Online" : "Offline";
    let statusIndicator = data.is_online ? "" : "offline";
    console.log(data.is_online);
    if (!data.its_me)
    {
        let followPlace = ""
        if (data.friend)
            followPlace = "Unfollow";
        else
            followPlace = "Follow";
        followShow = `<button class="btn btn-sm btn-outline-light follow-btn">${followPlace}</button>`;
    }
    return (`
    <img src="${data.avatar}" class="profile-avatar" alt="User Avatar">
    <div class="ml-3">
        <h4 class="username mb-0">${data.username}</h4>
        <div class="d-flex align-items-center mt-2">
            ${followShow}
            <span class="status-indicator ${statusIndicator} ml-3"></span>
            <span class="status-text ml-2">${onlineStatus}</span>
        </div>
    </div>
    `)
}

function profileStatsPart(data)
{
    return (`
        <div class="stat">
        <h5>Wins</h5>
        <p>${data.wins}</p>
        </div>
        <div class="stat">
            <h5>Losses</h5>
            <p>${data.loses}</p>
        </div>
        <div class="stat">
            <h5>Matches</h5>
            <p>${data.wins + data.loses}</p>
        </div>
    `)
}

function historyMatchView(data)
{
    let hi = document.querySelector("#matchHis");
    // const emptyHistoryMessage = document.getElementById('emptyHistoryMessage');
    if (data.length > 0)
        {
            // emptyHistoryMessage.style.display = 'none';
            data.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.innerHTML = historyMatchHelper(element);
                // newDiv.className = "match-item";
            hi.appendChild(newDiv);
        });
    }
}


function historyMatchHelper(data)
{
    return (`
    <div class="match d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center flex-grow-1">
            <img src="${data.plr1img}" class="player-avatar" alt="Player 1">
            <span class="player-name ml-2">${data.player1Email}</span>
            <span class="match-score ml-2">${data.player1Score}</span>
        </div>
        <span class="vs">vs</span>
        <div class="d-flex align-items-center flex-grow-1 justify-content-end">
            <span class="match-score mr-2">${data.player2Score}</span>
            <span class="player-name mr-2">${data.player2Email}</span>
            <img src="${data.plr2img}" class="player-avatar" alt="Player 2">
        </div>
        <span class="match-date ml-3">2023-05-01</span>
    </div>
    `)
}



