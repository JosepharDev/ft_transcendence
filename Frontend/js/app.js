import Router from "./Router.js";
import HomePage from "./pages/home_page.js";
import LoginPage from "./pages/login_page.js";
import ProfilePage from "./pages/profile_page.js";
import SettingsPage from "./pages/settings_page.js";
import Navbar from "./components/navbar.js"

window.addEventListener("DOMContentLoaded", () => {
    Router.init();
})