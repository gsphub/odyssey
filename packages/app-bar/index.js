const template = `

`

class NavigationBar extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `
    <style>
      h3 {
        
      }
    </style>
    <div class="hnt-nav-bar">
      <h1>Test</h1>
      <h2>babo</h2>
    </div>
    `
  }
}

window.customElements.define('navigation-bar', NavigationBar)


// Find the progress bar <div> in the DOM.
var progressBar = document.getElementById("percent-loaded");

// Set its ARIA roles and states,
// so that assistive technologies know what kind of widget it is.
progressBar.setAttribute("role", "progressbar");
progressBar.setAttribute("aria-valuemin", 0);
progressBar.setAttribute("aria-valuemax", 100);

// Create a function that can be called at any time to update
// the value of the progress bar.
function updateProgress(percentComplete) {
  progressBar.setAttribute("aria-valuenow", percentComplete);
}