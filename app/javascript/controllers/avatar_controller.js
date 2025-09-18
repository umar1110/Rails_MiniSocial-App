import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "preview", "image", "filename", "size"]

  preview(event) {
    const file = event.target.files[0]
    
    if (file) {
      // Show preview section
      const previewSection = document.getElementById('avatar-preview')
      if (previewSection) {
        previewSection.classList.remove('hidden')
      }

      // Create file reader
      const reader = new FileReader()
      
      reader.onload = (e) => {
        // Update preview image
        const previewImage = document.getElementById('preview-image')
        if (previewImage) {
          previewImage.src = e.target.result
        }

        // Update filename
        const filenameElement = document.getElementById('preview-filename')
        if (filenameElement) {
          filenameElement.textContent = file.name
        }

        // Update file size
        const sizeElement = document.getElementById('preview-size')
        if (sizeElement) {
          sizeElement.textContent = this.formatFileSize(file.size)
        }
      }

      reader.readAsDataURL(file)
    } else {
      // Hide preview section if no file selected
      const previewSection = document.getElementById('avatar-preview')
      if (previewSection) {
        previewSection.classList.add('hidden')
      }
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
