const template = document.createElement('template')
template.innerHTML = `
  <style>
    #footer {
      display: fixed;
      height: 10vh;
      border: 1px solid black;  
    }
  </style>
  <footer id="footer">
  </footer>
`

class Footer extends HTMLElement {
  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('h-footer', Footer)
