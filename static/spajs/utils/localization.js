import { dataGlobal } from "../views/globalData.js";

export const translations = {
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
        follow : "Follow",
        unfollow : "Unfollow",
        wins: "Wins",
        loses: "Losses",
        tournamentwins: "Tournament Wins",
        online : "Online",
        offline : "Offline",
        matchHistory: "Match History",
        followng: "Following",
        usersSearch : "Users Search",
        notFound : "No users found",
        search : "search",
        usernameSearch : "Enter a username",
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
        usernameSearch: "introducir un nombre de usuario...",
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
        usernameSearch: "saisir un nom d'utilisateur...",
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
    dataGlobal.selectedLanguage = selectedLanguage;


    document.querySelectorAll("[data-localize]").forEach(element => {
        const key = element.getAttribute("data-localize");
        element.textContent = translations[selectedLanguage][key];

        if (element.hasAttribute('placeholder'))
        {
            element.setAttribute('placeholder', translations[selectedLanguage][key]);
        }
    });
});

// Set default language to English
document.getElementById("language-selector").value = "en";
document.getElementById("language-selector").dispatchEvent(new Event("change"));
// </div>
