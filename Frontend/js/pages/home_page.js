export default class HomePage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("home_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)
    }
}

customElements.define("home-page", HomePage);