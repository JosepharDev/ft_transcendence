
export async function profileFriend(id)
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
        
        document.querySelector(".profile-section").innerHTML = profileFirstPartView(userData);
        historyMatchView(userData.matches);
    }
    catch (err)
    {
        document.querySelector(".profile-section").innerHTML = 
        '<div class="username-display">Error loading user profile</div>';
    }
    
}


function profileFriendHtml()
{
    return (`
    <div class="container profile-section">
    
    </div>
    
    <div class="container match-history">
    <h2 class="mb-4 text-center">Match History</h2>
    <div id="matchHistoryContainer">
    <!-- Match items will be here -->
    </div>
    <div class="empty-history" id="emptyHistoryMessage" style="display: none;">
    No match history available.
    </div>
    
        <!-- Add more match items as needed -->
    </div>
    `);
}





function profileFirstPartView(data)
{
    let flw = data.isFriend ? "Follow" : "Unfollow";
    let online = data.online ? "Online" : "Offline";
    let badge = data.online ? "badge-success" : "badge-danger";
    return (
        `
        <img src="${data.avatar}" alt="Profile Image" class="profile-image">
        <div class="username-display">${data.username}</div> <!-- Added username display -->
        <div>
        <button class="btn btn-primary follow-button">${flw}</button>
        </div>
        <div class="online-status">
        <span class="badge ${badge}">${online}</span>
        <!-- Use 'badge-danger' for offline status -->
        </div>
        <div class="stats">
        <div class="stat-item wins">
        <p>Wins: ${data.wins}</p>
        </div>
            <div class="stat-item losses">
            <p>Losses: ${data.loses}</p>
            </div>
            <div class="stat-item matches">
            <p>Matches: ${data.wins + data.loses}</p>
            </div>
            </div>`
        )
    }
    
function historyMatchView(data)
{
    
    let hi = document.querySelector("#matchHistoryContainer");
    const emptyHistoryMessage = document.getElementById('emptyHistoryMessage');
    if (data.length > 0)
        {
            emptyHistoryMessage.style.display = 'none';
            data.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.innerHTML = historyMatchViewHelper(element);
                newDiv.className = "match-item";
            hi.appendChild(newDiv);
        });
    }
    else
    {
        emptyHistoryMessage.style.display = 'block';
    }
}



function historyMatchViewHelper(data)
{
    return (
        `<img src="${data.plr1img}" alt="Player 1 Image" class="player-image">
        <span class="username">${data.player1Email}</span>
        <span class="score">${data.player1Score}</span>
        <span class="vs">vs</span>
        <span class="score">${data.player2Score}</span>
        <span class="username">${data.player2Email}</span>
        <img src="${data.plr2img}" alt="Player 2 Image" class="player-image">`
    );
}
