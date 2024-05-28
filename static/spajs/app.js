import {tuto} from './views/views.js'
import {dataGlobal, url} from './views/globalData.js'
import {homeView} from './views/home.js'
import {urlLocationHandler} from './utils/locationHandles.js'
import {urlRoute} from './utils/urlRoute.js'

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
        go: "Go"
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
        go: "Ir"
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
        go: "Aller"
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



tuto();
console.log(url);
homeView();
window.onpopstate = urlLocationHandler;
window.route = urlRoute;
urlLocationHandler();
