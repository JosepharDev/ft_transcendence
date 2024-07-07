import { localPong } from "./localGame.js";

export async function tournamentView()
{
    let app = document.getElementById("app");
    app.innerHTML = tournamentHtml();

    // tournamentForm = document.getElementById("tournamentForm");
    // tournamentForm.addEventListener('submit', tournamentSubmitEvent)
}


function tournamentHtml()
{
    return (`
            <div class="bracket-wrapper">
            <div class="container">
                <div class="bracket-container">
                    <!-- First Round -->
                    <div class="round">
                        <div class="matchup">Player 1</div>
                        <div class="connector"></div>
                        <div class="matchup">Player 2</div>
                    </div>
                    <div class="round">
                        <div class="matchup">Player 3</div>
                        <div class="connector"></div>
                        <div class="matchup">Playddddd 4</div>
                    </div>
                    <!-- Semi-Finals -->
                    <div class="round">
                        <div class="horizontal-connector"></div>
                        <div class="matchup winner">Winner1</div>
                        <div class="connector"></div>
                        <div class="matchup winner">Winner4</div>
                        <div class="horizontal-connector"></div>
                    </div>
                    <!-- Final -->
                    <div class="round">
                        <div class="final-connector"></div>
                        <div class="matchup winner final-winner">Final Winner</div>
                        <div class="final-connector"></div>
                    </div>
                </div>
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
