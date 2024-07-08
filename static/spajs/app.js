import {tuto} from './views/views.js'
import {dataGlobal, url} from './views/globalData.js'
import {homeView} from './views/home.js'
import {urlLocationHandler} from './utils/locationHandles.js'
import {urlRoute} from './utils/urlRoute.js'
import { pushUrl } from './utils/urlRoute.js'
import { checkAuthentication } from './views/checkAuth.js'



// const translations = {
//     en: {
//         tournament: "Tournament",
//         "tournament-desc": "Participate in tournaments.",
//         training: "Training",
//         "training-desc": "Improve your skills.",
//         remote1vs1: "Remote 1vs1",
//         "remote1vs1-desc": "Play 1vs1 remotely.",
//         remote2vs2: "Remote 2vs2",
//         "remote2vs2-desc": "Play 2vs2 remotely.",
//         search: "Search",
//         "search-desc": "Search for players.",
//         friends: "Friends",
//         "friends-desc": "Connect with friends.",
//         go: "Go",


//         local : "1 vs 1 Local",
//         online1 : "1 vs 1 Online",
//         online2 : "2 vs 2 Online",
//         tournament : "Tournament (4 players)",

//         follow : "follow",
//         unfollow : "unfollow",


//         wins: "Wins",
//         loses: "Loses",
//         tournamentwins: "Tournament Wins",
//         online : "Online",
//         offline : "Offline",
//         matchHistory: "Match History",
//         followng: "Following",
        
//         usersSearch : "Users Search",
//         search : "search",
//         enterUsername : "enter a username...",

//         uploadAvatar : "upload avatar",
//         username : "Username",
//         enterUsername : "Enter new username",
//         tournamentNickname : "Tournament nickname",
//         enterNickname : "Enter new nickname",
//         updateProfile : "Update Profile",
//         enable2fa : "Enable 2FA",
//         disable2fa : "Disable 2FA",
//         enterOtp : "Enter OTP code",
//         submitOtp : "Submit 2FA Code",



//     },
//     es: {
//         tournament: "Torneo",
//         "tournament-desc": "Participa en torneos.",
//         training: "Entrenamiento",
//         "training-desc": "Mejora tus habilidades.",
//         remote1vs1: "Remoto 1vs1",
//         "remote1vs1-desc": "Juega 1vs1 a distancia.",
//         remote2vs2: "Remoto 2vs2",
//         "remote2vs2-desc": "Juega 2vs2 a distancia.",
//         search: "Buscar",
//         "search-desc": "Busca jugadores.",
//         friends: "Amigos",
//         "friends-desc": "Conéctate con amigos.",
//         go: "Ir"
//     },
//     fr: {
//         tournament: "Tournoi",
//         "tournament-desc": "Participez à des tournois.",
//         training: "Entraînement",
//         "training-desc": "Améliorez vos compétences.",
//         remote1vs1: "Distant 1vs1",
//         "remote1vs1-desc": "Jouez 1vs1 à distance.",
//         remote2vs2: "Distant 2vs2",
//         "remote2vs2-desc": "Jouez 2vs2 à distance.",
//         search: "Recherche",
//         "search-desc": "Rechercher des joueurs.",
//         friends: "Amis",
//         "friends-desc": "Connectez-vous avec des amis.",
//         go: "Aller"
//     }
// };


const translations = {
    en: {
        tournament: "Tournament",
        "tournament-desc": "Participate in tournaments.",
        training: "Training",
        "training-desc": "Improve your skills.",
        remote1vs1: "Remote 1vs1",
        "remote1vs1-desc": "Play 1vs1 remotely.",
        remote2vs2: "Remote 2vs2",
        "remote2vs2-desc": "Play 2vs2 remotely.",
        search: "Search",
        "search-desc": "Search for players.",
        friends: "Friends",
        "friends-desc": "Connect with friends.",
        go: "Go",
        local : "1 vs 1 Local",
        online1 : "1 vs 1 Online",
        online2 : "2 vs 2 Online",
        tournament : "Tournament (4 players)",
        follow : "follow",
        unfollow : "unfollow",
        wins: "Wins",
        loses: "Loses",
        tournamentwins: "Tournament Wins",
        online : "Online",
        offline : "Offline",
        matchHistory: "Match History",
        followng: "Following",
        usersSearch : "Users Search",
        search : "search",
        enterUsername : "enter a username...",
        uploadAvatar : "upload avatar",
        username : "Username",
        enterUsername : "Enter new username",
        tournamentNickname : "Tournament nickname",
        enterNickname : "Enter new nickname",
        updateProfile : "Update Profile",
        enable2fa : "Enable 2FA",
        disable2fa : "Disable 2FA",
        enterOtp : "Enter OTP code",
        submitOtp : "Submit 2FA Code",
    },
    es: {
        tournament: "Torneo",
        "tournament-desc": "Participa en torneos.",
        training: "Entrenamiento",
        "training-desc": "Mejora tus habilidades.",
        remote1vs1: "Remoto 1vs1",
        "remote1vs1-desc": "Juega 1vs1 a distancia.",
        remote2vs2: "Remoto 2vs2",
        "remote2vs2-desc": "Juega 2vs2 a distancia.",
        search: "Buscar",
        "search-desc": "Busca jugadores.",
        friends: "Amigos",
        "friends-desc": "Conéctate con amigos.",
        go: "Ir",
        local: "1 vs 1 Local",
        online1: "1 vs 1 En línea",
        online2: "2 vs 2 En línea",
        tournament: "Torneo (4 jugadores)",
        follow: "seguir",
        unfollow: "dejar de seguir",
        wins: "Victorias",
        loses: "Derrotas",
        tournamentwins: "Victorias en torneos",
        online: "En línea",
        offline: "Desconectado",
        matchHistory: "Historial de partidas",
        followng: "Siguiendo",
        usersSearch: "Buscar usuarios",
        search: "buscar",
        enterUsername: "introducir un nombre de usuario...",
        uploadAvatar: "subir avatar",
        username: "Nombre de usuario",
        enterUsername: "Introducir nuevo nombre de usuario",
        tournamentNickname: "Apodo de torneo",
        enterNickname: "Introducir nuevo apodo",
        updateProfile: "Actualizar perfil",
        enable2fa: "Activar 2FA",
        disable2fa: "Desactivar 2FA",
        enterOtp: "Introducir código OTP",
        submitOtp: "Enviar código 2FA",
    },
    fr: {
        tournament: "Tournoi",
        "tournament-desc": "Participez à des tournois.",
        training: "Entraînement",
        "training-desc": "Améliorez vos compétences.",
        remote1vs1: "Distant 1vs1",
        "remote1vs1-desc": "Jouez 1vs1 à distance.",
        remote2vs2: "Distant 2vs2",
        "remote2vs2-desc": "Jouez 2vs2 à distance.",
        search: "Recherche",
        "search-desc": "Rechercher des joueurs.",
        friends: "Amis",
        "friends-desc": "Connectez-vous avec des amis.",
        go: "Aller",
        local: "1 vs 1 Local",
        online1: "1 vs 1 En ligne",
        online2: "2 vs 2 En ligne",
        tournament: "Tournoi (4 joueurs)",
        follow: "suivre",
        unfollow: "ne plus suivre",
        wins: "Victoires",
        loses: "Défaites",
        tournamentwins: "Victoires en tournoi",
        online: "En ligne",
        offline: "Hors ligne",
        matchHistory: "Historique des matchs",
        followng: "Suivi",
        usersSearch: "Recherche d'utilisateurs",
        search: "rechercher",
        enterUsername: "saisir un nom d'utilisateur...",
        uploadAvatar: "télécharger un avatar",
        username: "Nom d'utilisateur",
        enterUsername: "Saisir un nouveau nom d'utilisateur",
        tournamentNickname: "Surnom de tournoi",
        enterNickname: "Saisir un nouveau surnom",
        updateProfile: "Mettre à jour le profil",
        enable2fa: "Activer 2FA",
        disable2fa: "Désactiver 2FA",
        enterOtp: "Saisir le code OTP",
        submitOtp: "Soumettre le code 2FA",
    }
};










document.getElementById("language-selector").addEventListener("change", function() {
    const selectedLanguage = this.value;
    document.querySelectorAll("[data-localize]").forEach(element => {
        const key = element.getAttribute("data-localize");
        element.textContent = translations[selectedLanguage][key];
    });
});

// Set default language to English
document.getElementById("language-selector").value = "en";
document.getElementById("language-selector").dispatchEvent(new Event("change"));
// </div>

document.getElementById("logout").addEventListener('click', async (e)=>{
    e.preventDefault();
    const request = new Request(
        '/api/logout/',
        {
            method: 'GET',
        }
    );
    let res = await fetch(request);
    let js = await res.json();
    if (js.message === "success")
    {
        document.querySelector("#navi").classList.add("hideme");
        
        pushUrl('/signin');
    }
})

document.getElementById("home").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/');
})

document.getElementById("search").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/search');
})

document.getElementById("friends").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/s');
})
document.getElementById("set").addEventListener('click', async (e)=>{
    e.preventDefault();
    pushUrl('/settings');
})


// tuto();
console.log(url);
// homeView();

async function ini()
{

// Some random colors
const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const numBalls = 70;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 90)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 90)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}

// // Keyframes
// balls.forEach((el, i, ra) => {
//   let to = {
//     x: Math.random() * (i % 2 === 0 ? -11 : 11),
//     y: Math.random() * 12
//   };

//   let anim = el.animate(
//     [
//       { transform: "translate(0, 0)" },
//       { transform: `translate(${to.x}rem, ${to.y}rem)` }
//     ],
//     {
//       duration: (Math.random() + 1) * 2000, // random duration
//       direction: "alternate",
//       fill: "both",
//       iterations: Infinity,
//       easing: "ease-in-out"
//     }
//   );
// });




    window.onpopstate = urlLocationHandler;
    window.route = urlRoute;

    const authStatus = await checkAuthentication();
    if (authStatus === "2fa") {
        pushUrl('/twofa');
        return;
    }
    else if (authStatus === 'signin' || authStatus === 'notfff')
    {
        pushUrl('/signin');
        return ;
    }
    document.querySelector(".hideme").classList.remove("hideme");

    urlLocationHandler();

}

document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    ini()
  });