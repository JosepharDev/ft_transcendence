export default class SearchPage extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback(){
        const template = document.getElementById("search_template")
        const content = template.content.cloneNode(true)
        this.appendChild(content)
    }
}

customElements.define("search-page", SearchPage);