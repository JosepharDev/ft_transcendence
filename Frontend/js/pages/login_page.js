import Router from "../Router.js"

export default class LoginPage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const template = document.getElementById("login_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)

        this.querySelector("button").addEventListener("click", (event) => {
            Router.go("/home")
        });
    }   
}

customElements.define("login-page", LoginPage);