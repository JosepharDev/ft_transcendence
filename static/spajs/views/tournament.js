import { localPong } from "./localGame.js";

export async function tournamentView()
{
    let app = document.getElementById("app");
    app.innerHTML = tournamentHtml();

    tournamentForm = document.getElementById("tournamentForm");
    tournamentForm.addEventListener('submit', tournamentSubmitEvent)
}


function tournamentHtml()
{
    return (`
    <div class="tournament">
    <div class="form-container" id="formContainer">
    <div class="form-header">
            <h2>Tournament Registration</h2>
            </div>
            <form id="tournamentForm">
            <div class="form-group">
            <label for="player1">Player 1</label>
                <input type="text" class="form-control" id="player1" placeholder="Enter username">
                </div>
                <div class="form-group">
                <label for="player2">Player 2</label>
                <input type="text" class="form-control" id="player2" placeholder="Enter username">
                </div>
                <div class="form-group">
                <label for="player3">Player 3</label>
                <input type="text" class="form-control" id="player3" placeholder="Enter username">
                </div>
                <div class="form-group">
                <label for="player4">Player 4</label>
                <input type="text" class="form-control" id="player4" placeholder="Enter username">
                </div>
                <button id="mybtn" type="submit" class="btn btn-primary btn-block">Submit</button>
                </form>
                </div>
        </div>
                `)
            }

function tournamentSubmitEvent(e)
{
    e.preventDefault();

    console.log("ERORORORORO");
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const player3 = document.getElementById('player3').value;
    const player4 = document.getElementById('player4').value;

    if (!player1 || !player2 || !player3 || !player4) {
        alert('Please enter all player usernames');
        return;
    }

    const players = [player1, player2, player3, player4];
    const matches = [
        `${players[0]} vs ${players[1]}`,
        `${players[2]} vs ${players[3]}`,
    ];

    document.getElementById("app").innerHTML = `
    <div class="tournament">
    <div class="matches-container" id="matchesContainer">
        <div class="matches-header">
            <h2>Upcoming Matches</h2>
        </div>
        <div id="matchmaking"></div>
        <button id="mybtn" class="btn btn-primary btn-back">start tournament</button>
    </div>
    </div>
    `

    let matchmakingDiv = document.getElementById('matchmaking');
    matchmakingDiv.innerHTML = '';

    matches.forEach((match, index) => {
        let matchDiv = document.createElement('div');
        matchDiv.className = 'match';
        matchDiv.textContent = `${match}`;
        matchmakingDiv.appendChild(matchDiv);
    });

    let obj = {
        game:"tournament",
        vs1: player1,
        vs2: player2,
        'player1' : player1,
        'player2' : player2,
        'player3' : player3,
        'player4' : player4,
        partGame : 0,
    }

    document.getElementById("mybtn").addEventListener('click', (e)=>{
        e.preventDefault();
        localPong(1, obj)
    })

}

// function startTournament()
// {

// }
