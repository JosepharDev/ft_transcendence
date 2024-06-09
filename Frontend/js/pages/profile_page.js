export default class ProfilePage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("profile_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)
    }
}

customElements.define("profile-page", ProfilePage);