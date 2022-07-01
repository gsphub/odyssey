class Modal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.isOpen = false
    this.shadowRoot.innerHTML = `
      <style>
      </style>
      <div id="backdrop"></div>
      <div id="modal"></div>
    `
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute('opened')) {
      this.isOpen = true
    } else {
      this.isOpen = false
    }
  }

  static get observedAttributes() {
    return ['opened']
  }

  open() {
    this.setAttribute('opened', '')
    this.isOpen = true
  }

  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened')
    }
    this.isOpen = false
  }

  _cancel(event) {
    this.hide()
    const cancelEvent = new Event('cancel', {
      bubbles: true,
      composed: true,
    })
    event.target.dispatchEvent(cancelEvent)
  }

  _confirm(event) {
    this.hide()
    const confirmEvent = new Event('confirm')
    this.dispatchEvent(confirmEvent)
  }
}

customElements.define('hnt-modal', Modal)
