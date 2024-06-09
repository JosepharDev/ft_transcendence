export default class SettingsPage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("settings_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)
    }
}

customElements.define("settings-page", SettingsPage);