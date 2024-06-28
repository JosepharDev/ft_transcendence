import Router from "../Router.js"

export default class Navbar extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("nav-bar_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)

        this.querySelector(".settings").addEventListener("click", (event) => {
            Router.go("/settings")
        })
        this.querySelector(".home").addEventListener("click", (event) => {
            Router.go("/home")
            })
        this.querySelector(".search").addEventListener("click", (event) => {
            Router.go("/search")
        })
        this.querySelector(".language").addEventListener("click", (event) => {
            // Router.go("")
        })
        this.querySelector(".exit").addEventListener("click", (event) => {
            // Router.go("")
        })
    }
}

customElements.define("nav-bar", Navbar);