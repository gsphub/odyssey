const template = document.createElement('template')

template.innerHTML = `
  <style>
    #backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75)
      z-index: 10;
      opacity: 0;
      pointer-events: none;
    }
    
    :host([opened]) #backdrop,
    :host([opened]) #modal {
      opacity: 1;
      pointer-events: all;
    }
    
    :host([opened]) #modal {
      top: 15vh;
    }
    
    #modal {
      position: fixed;
      top: 10vh;
      left: 25%;
      width: 50%;
      z-index: 100;
      background: white;
      border-radius: 3px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26)
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease-out;
    }
    
    header {
      padding: 1rem;
      border-bottom: 1px solid #ccc;
    }
    
    ::slotted(h1) {
      font-size: 1.25rem;
      margin: 0;
    }
    
    #main {
      padding: 1rem;
    }
    
    #actions {
      border-top: 1px solid #ccc;
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
    }
    
    #actions button {
      margin: 0 0.25rem;
    }
    
  </style>
  <div id="backdrop"></div>
  <div id="modal">
    <header>
      <slot name="title">Naaaaame</slot>
    </header>
    <section id="main">
      <slot></slot>
    </section>
    <section id="actions">
      <button id="cacel-button>Cancel</button>
      <button id="confirm-button">Okay></button>
    </section>
  </div>
`

class Modal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.isOpen = false
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
    
  }
  
  hide() {
    
  }
  
  _cancel(event) {
    
  }
  
  _confirm() {
    this.hide()
    const confirmEvent = 
  } 
}

customElements.define('h-modal', Modal)

if (customElements.get('h-modal')) {
  console.warn('h-modal custom element already registered!')
} else {
  customElements.define('h-modal', Modal)
}
