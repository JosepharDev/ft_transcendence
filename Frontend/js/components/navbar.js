import Router from "../Router.js"

export default class Navbar extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("nav-bar_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)

        this.querySelector(".login_button").addEventListener("click", (event) => {
            Router.go("/login")
        })
        this.querySelector(".home_button").addEventListener("click", (event) => {
            Router.go("/home")
        })
        this.querySelector(".profile_button").addEventListener("click", (event) => {
            Router.go("/profile")
        })
        this.querySelector(".settings_button").addEventListener("click", (event) => {
            Router.go("/settings")
        })
    }
}

customElements.define("nav-bar", Navbar);