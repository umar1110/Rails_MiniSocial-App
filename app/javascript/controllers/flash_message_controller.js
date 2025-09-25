import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = []
  
  connect() {
    console.log("Flash message controller connected", this.element)
    // Auto-dismiss after 2 seconds
    this.timeout = setTimeout(() => {
      console.log("Auto-dismissing flash message")
      this.dismiss()
    }, 2000)
  }

  disconnect() {
    // Clear timeout if component is removed before auto-dismiss
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  dismiss() {
    console.log("Dismissing flash message")
    // Simple fade out and remove
    this.element.style.opacity = "0"
    this.element.style.transition = "opacity 0.3s ease-out"
    
    setTimeout(() => {
      console.log("Removing flash message element")
      this.element.remove()
    }, 300)
  }
}
